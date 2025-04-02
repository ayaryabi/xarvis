import { headers } from 'next/headers';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client'; // Your Stripe client instance

// Import the database functions we just created
import {
  findPlanIdByStripePriceId,
  upsertOrganizationSubscription,
  updateSubscriptionStatusBySubId,
  findOrgIdByStripeSubId,
} from '@/lib/supabase/db';

// Ensure the webhook secret is set in environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  // Log a critical error during server startup if the secret is missing
  console.error('CRITICAL: STRIPE_WEBHOOK_SECRET environment variable not set.');
  // Optionally, throw an error to prevent the server from starting without it
  // throw new Error('Missing environment variable: STRIPE_WEBHOOK_SECRET');
}

/**
 * Handles incoming webhook events from Stripe.
 */
export async function POST(req: Request) {
  // Ensure the secret is available before proceeding (runtime check)
  if (!webhookSecret) {
    console.error('Stripe webhook secret is not configured.');
    return new NextResponse('Webhook Error: Server configuration missing.', { status: 500 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;
  let event: Stripe.Event;

  try {
    // 1. Verify Signature
    console.log('[Webhook] Attempting to verify signature...');
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`[Webhook] Signature verified. Received event: ${event.type}`);

  } catch (err: any) {
    // Log the specific verification error
    console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // --- Implement Event Processing Logic --- 
  console.log('[Webhook] Processing event:', event.type);
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('[Webhook] Handling checkout.session.completed...');
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        // Validate necessary data from checkout session
        if (!checkoutSession.subscription || !checkoutSession.customer || !checkoutSession.invoice) {
          throw new Error('Webhook Error: Missing subscription, customer, or invoice ID on checkout.session.completed');
        }

        const stripeSubscriptionId_cs = typeof checkoutSession.subscription === 'string'
          ? checkoutSession.subscription
          : checkoutSession.subscription?.id;
        const stripeInvoiceId_cs = typeof checkoutSession.invoice === 'string' 
          ? checkoutSession.invoice 
          : checkoutSession.invoice?.id;
          
        if (!stripeSubscriptionId_cs) {
            throw new Error('Webhook Error: Could not determine Stripe Subscription ID from checkout session.');
        }

        // Attempt 1: Retrieve Subscription and check its metadata
        console.log(`[Webhook] Retrieving subscription ${stripeSubscriptionId_cs} to check metadata...`);
        const subscription_cs = await stripe.subscriptions.retrieve(stripeSubscriptionId_cs);
        let orgId_cs = subscription_cs.metadata?.supabaseOrgId; // Optional chaining
        console.log(`[Webhook] Org ID from Subscription metadata: ${orgId_cs}`);

        // Attempt 2 (Fallback): If not on Subscription, check Invoice metadata
        if (!orgId_cs) {
          // Check if invoice ID exists and is a string
          if (typeof stripeInvoiceId_cs === 'string') { 
            const definiteInvoiceId = stripeInvoiceId_cs; // TS knows this is string
            console.warn(`[Webhook] Metadata not found on subscription ${stripeSubscriptionId_cs}. Retrieving invoice ${definiteInvoiceId} as fallback...`);
            try {
              if (!definiteInvoiceId) {
                 throw new Error("Internal logic error: definiteInvoiceId is unexpectedly falsy.");
              }
              const invoice_cs = await stripe.invoices.retrieve(definiteInvoiceId); 
              // console.log('[Webhook] Retrieved Invoice Object (Fallback):', JSON.stringify(invoice_cs, null, 2));

              // Assign to temp variable and check type before assigning to orgId_cs
              const orgIdFromInvoice = invoice_cs.subscription_details?.metadata?.supabaseOrgId;
              console.log(`[Webhook] Org ID from Invoice metadata (Fallback Attempt): ${orgIdFromInvoice}`);
              if (typeof orgIdFromInvoice === 'string') {
                orgId_cs = orgIdFromInvoice;
                console.log(`[Webhook] Updated orgId_cs from Invoice fallback.`);
              }

            } catch (invoiceError: any) {
               console.error(`[Webhook Error] Failed to retrieve invoice ${definiteInvoiceId} during fallback: ${invoiceError.message}`);
               // Don't throw here, just proceed without the orgId found via invoice
            }
          } else {
             // Log if the invoice ID wasn't usable for fallback
             console.warn(`[Webhook] Invoice ID was missing or not a string on checkout session ${checkoutSession.id}, cannot perform invoice fallback.`);
          }
        }

        // Final Check: If Org ID still not found, we cannot proceed
        if (!orgId_cs) {
            throw new Error(`Webhook Error: Could not find supabaseOrgId metadata on Subscription ${stripeSubscriptionId_cs} or associated Invoice ${stripeInvoiceId_cs || 'N/A'}.`);
        }
        console.log(`[Webhook] Using Org ID ${orgId_cs} for database operation.`);

        // --- Continue with the rest of the logic using the found orgId_cs --- 

        const priceId_cs = subscription_cs.items.data[0]?.price.id;
        if (!priceId_cs) {
          throw new Error(`Webhook Error: Price ID not found on subscription items for ${subscription_cs.id}`);
        }

        const internalPlanId_cs = await findPlanIdByStripePriceId(priceId_cs);
        if (!internalPlanId_cs) {
          throw new Error(`Webhook Error: Plan ID lookup failed for Stripe price ID: ${priceId_cs}`);
        }

        const subscriptionData_cs = {
          organization_id: orgId_cs, // Use the Org ID found from Sub or Invoice
          plan_id: internalPlanId_cs,
          stripe_subscription_id: subscription_cs.id,
          stripe_customer_id: typeof subscription_cs.customer === 'string' ? subscription_cs.customer : subscription_cs.customer.id,
          status: subscription_cs.status, 
          current_period_start: new Date(subscription_cs.current_period_start * 1000),
          current_period_end: new Date(subscription_cs.current_period_end * 1000),
          trial_ends_at: subscription_cs.trial_end ? new Date(subscription_cs.trial_end * 1000) : null,
        };

        await upsertOrganizationSubscription(subscriptionData_cs);
        console.log(`[Webhook] Successfully processed checkout.session.completed for Org: ${subscriptionData_cs.organization_id}`);
        break;

      case 'invoice.paid':
        console.log('[Webhook] Handling invoice.paid...');
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') { // Handle recurring cycle payments
          const stripeSubscriptionId_ip = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
          if (!stripeSubscriptionId_ip) throw new Error('Missing subscription ID in invoice.paid');
          
          // Retrieve the subscription to ensure we have the latest status and plan info
          const subscription_ip = await stripe.subscriptions.retrieve(stripeSubscriptionId_ip);
          const priceId_ip = subscription_ip.items.data[0]?.price.id;
          if (!priceId_ip) throw new Error(`Price ID not found on subscription items for ${subscription_ip.id}`);
          const internalPlanId_ip = await findPlanIdByStripePriceId(priceId_ip);
          if (!internalPlanId_ip) throw new Error(`Plan ID lookup failed for Stripe price ID: ${priceId_ip}`);

          // Try to get orgId from metadata, fallback to DB lookup
          let orgId_ip: string | null = subscription_ip.metadata.supabaseOrgId;
          if (!orgId_ip) {
              console.warn(`[Webhook] Missing supabaseOrgId metadata on subscription ${subscription_ip.id} during invoice.paid. Attempting DB lookup.`);
              orgId_ip = await findOrgIdByStripeSubId(subscription_ip.id);
          }

          // If still not found, we cannot proceed. Log an error and skip.
          if (!orgId_ip) {
              console.error(`[Webhook Error] Could not determine organization ID for subscription ${subscription_ip.id} during invoice.paid.`);
              break; 
          }

          // Now orgId_ip is guaranteed to be a string here
          const subscriptionData_ip = {
            organization_id: orgId_ip,
            plan_id: internalPlanId_ip,
            stripe_subscription_id: subscription_ip.id,
            stripe_customer_id: typeof subscription_ip.customer === 'string' ? subscription_ip.customer : subscription_ip.customer.id,
            status: subscription_ip.status, // Should be 'active' after payment
            current_period_start: new Date(subscription_ip.current_period_start * 1000),
            current_period_end: new Date(subscription_ip.current_period_end * 1000),
            trial_ends_at: subscription_ip.trial_end ? new Date(subscription_ip.trial_end * 1000) : null,
          };
          
          await upsertOrganizationSubscription(subscriptionData_ip);
          console.log(`[Webhook] Successfully processed invoice.paid for Org: ${orgId_ip}`);
        }
        break;

      case 'customer.subscription.updated':
        console.log('[Webhook] Handling customer.subscription.updated...');
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        const previousAttributes = event.data.previous_attributes;
        
        // Check if relevant attributes changed - focusing on status, items, and cancellation
        if (previousAttributes && (previousAttributes.status || previousAttributes.items || previousAttributes.cancel_at_period_end !== undefined)) {
            const priceId_su = subscriptionUpdated.items.data[0]?.price.id;
            if (!priceId_su) throw new Error(`Price ID not found on subscription items for ${subscriptionUpdated.id}`);
            const internalPlanId_su = await findPlanIdByStripePriceId(priceId_su);
            if (!internalPlanId_su) throw new Error(`Plan ID lookup failed for Stripe price ID: ${priceId_su}`);

            // Try to get orgId from metadata, fallback to DB lookup
            let orgId_su: string | null = subscriptionUpdated.metadata.supabaseOrgId;
            if (!orgId_su) {
              console.warn(`[Webhook] Missing supabaseOrgId metadata on subscription ${subscriptionUpdated.id} during customer.subscription.updated. Attempting DB lookup.`);
              orgId_su = await findOrgIdByStripeSubId(subscriptionUpdated.id);
            }

            // If still not found, we cannot proceed. Log an error and skip.
            if (!orgId_su) {
              console.error(`[Webhook Error] Could not determine organization ID for subscription ${subscriptionUpdated.id} during customer.subscription.updated.`);
              break; 
            }

            // Now orgId_su is guaranteed to be a string here
            const subscriptionData_su = {
              organization_id: orgId_su,
              plan_id: internalPlanId_su,
              stripe_subscription_id: subscriptionUpdated.id,
              stripe_customer_id: typeof subscriptionUpdated.customer === 'string' ? subscriptionUpdated.customer : subscriptionUpdated.customer.id,
              status: subscriptionUpdated.status, // Get the new status
              current_period_start: new Date(subscriptionUpdated.current_period_start * 1000),
              current_period_end: new Date(subscriptionUpdated.current_period_end * 1000),
              trial_ends_at: subscriptionUpdated.trial_end ? new Date(subscriptionUpdated.trial_end * 1000) : null,
            };
            await upsertOrganizationSubscription(subscriptionData_su);
            console.log(`[Webhook] Successfully processed customer.subscription.updated for Org: ${orgId_su}`);
            
        } else {
             console.log(`[Webhook] customer.subscription.updated event for ${subscriptionUpdated.id} - no relevant changes detected in previous_attributes.`);
        }
        break;

      case 'customer.subscription.deleted':
        console.log('[Webhook] Handling customer.subscription.deleted...');
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        // Use the specific status update function for deletion
        await updateSubscriptionStatusBySubId(subscriptionDeleted.id, 'canceled'); // Or 'deleted', based on your desired status
        console.log(`[Webhook] Successfully processed customer.subscription.deleted for Sub: ${subscriptionDeleted.id}`);
        break;

      default:
        // Optionally log unhandled events
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
    console.log(`[Webhook] Finished processing event: ${event.type}`);

  } catch (error: any) {
    // Catch errors during event processing (e.g., DB errors)
    console.error(`[Webhook Error] Error processing event ${event.type}:`, error);
    return new NextResponse(`Webhook handler error: ${error.message || 'Unknown error'}`, { status: 500 });
  }

  // Return 200 OK to Stripe
  return new NextResponse(null, { status: 200 });
}
