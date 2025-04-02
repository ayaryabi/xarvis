import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { stripe } from '@/lib/stripe/client'; // Import initialized Stripe client
import { getUserOrgSubRoleAndEmail } from '@/lib/supabase/db'; // Import our DB helper
import { getBaseUrl } from '@/lib/utils/url'; // Import URL helper

// Define the expected shape of the request body
interface RequestBody {
  priceId?: string;
}

export async function POST(req: Request) {
  console.log("[API /checkout] POST request received.");

  try {
    // 1. Authentication
    const { userId: clerkId } = auth(); // Only need clerkId initially
    if (!clerkId) {
      console.warn("[API /checkout] Unauthorized access attempt.");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(`[API /checkout] Authenticated user (Clerk ID): ${clerkId}`);

    // 2. Validate Request Body
    let priceId: string | undefined;
    try {
      const body: RequestBody = await req.json();
      priceId = body.priceId;
    } catch (error) {
      console.warn("[API /checkout] Invalid request body:", error);
      return new NextResponse("Invalid request body", { status: 400 });
    }

    if (!priceId) {
      console.warn("[API /checkout] Price ID is required.");
      return new NextResponse("Price ID is required", { status: 400 });
    }
    console.log(`[API /checkout] Requested Price ID: ${priceId}`);

    // 3. Get Org, Subscription, Role, Email & Authorize
    const { organizationId, subscription, role, email: userEmailFromDb } = await getUserOrgSubRoleAndEmail(clerkId);

    if (!organizationId) {
      console.error(`[API /checkout] Failed to find organization for user (Clerk ID) ${clerkId}`);
      return new NextResponse("User organization not found or lookup failed.", { status: 500 });
    }
    console.log(`[API /checkout] User (Clerk ID) ${clerkId} belongs to Org ${organizationId} with role ${role}`);

    // ** ADD ROLE CHECK **
    if (role !== 'admin') { // Only allow admins to initiate checkout
      console.warn(`[API /checkout] Forbidden: User ${clerkId} (role: ${role}) attempted checkout for Org ${organizationId}.`);
      return new NextResponse("Forbidden: Only admins can manage subscriptions.", { status: 403 });
    }

    // Check existing subscription status
    if (subscription && (subscription.status === 'active' || subscription.status === 'trialing')) {
      console.log(`[API /checkout] Org ${organizationId} already has an ${subscription.status} subscription.`);
      return NextResponse.json({ message: 'You already have an active subscription.' }, { status: 400 });
    }
    console.log(`[API /checkout] No active/trialing subscription found for Org ${organizationId}. Proceeding...`);

    // 4. Construct Redirect URLs
    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/dashboard?checkout=success`;
    const cancelUrl = `${baseUrl}/?checkout=cancel`;
    console.log(`[API /checkout] Base URL: ${baseUrl}, Success: ${successUrl}, Cancel: ${cancelUrl}`);

    // 5. Create Stripe Checkout Session
    // Use the email fetched from the database
    const prefillEmail = typeof userEmailFromDb === 'string' ? userEmailFromDb : undefined;
    console.log(`[API /checkout] Pre-filling email from DB: ${prefillEmail}`); 
    console.log("[API /checkout] Creating Stripe Checkout Session...");
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: prefillEmail, // Use email from DB
      subscription_data: {
        trial_period_days: 7, 
        metadata: { 
          supabaseUserId: clerkId, // Still store clerkId for reference if needed
          supabaseOrgId: organizationId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!stripeSession.url) {
      console.error("[API /checkout] Stripe session creation failed, no URL returned.");
      throw new Error("Could not create Stripe checkout session."); // Let generic error handler catch this
    }

    console.log(`[API /checkout] Stripe session created: ${stripeSession.id} for Org ${organizationId}`);
    // 6. Return the Session URL
    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error("[API /checkout] Internal Server Error:", error);
    // Generic error response
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
