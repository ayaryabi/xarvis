import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';

import { createUserWithOrganization } from '@/lib/supabase/db';
import { updateUserProfile } from '@/lib/supabase/auth';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Log the headers for debugging
  console.log('Webhook Headers:', {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  // Get the body
  let payload;
  let body;
  try {
    payload = await req.json();
    console.log('Webhook Payload:', JSON.stringify(payload));
    body = JSON.stringify(payload);
  } catch (err) {
    console.error('Error parsing request body:', err);
    return new NextResponse('Error parsing request body', { status: 400 });
  }

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new NextResponse('Missing webhook secret', { status: 500 });
  }

  console.log('Using webhook secret:', webhookSecret.substring(0, 5) + '...');

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;
  
  try {
    // Verify the payload with the headers
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    
    console.log('Webhook verification successful. Event type:', evt.type);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse(`Error verifying webhook: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  try {
    if (eventType === 'user.created') {
      // New user created in Clerk
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      console.log('Processing user.created event for user:', id);
      
      // Create user in our database with organization and free plan
      await createUserWithOrganization({
        clerk_id: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
        avatar_url: image_url,
      });
      
      console.log(`User created: ${id}`);
    }
    else if (eventType === 'user.updated') {
      // User updated in Clerk
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      console.log('Processing user.updated event for user:', id);
      
      // Update user in our database
      await updateUserProfile({
        id,
        emailAddresses: email_addresses.map(email => ({ emailAddress: email.email_address })),
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      });
      
      console.log(`User updated: ${id}`);
    }
    else if (eventType === 'user.deleted') {
      // User deleted in Clerk
      const { id } = evt.data;
      
      console.log('Processing user.deleted event for user:', id);
      
      // You could add logic here to handle user deletion
      console.log(`User deleted: ${id}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 