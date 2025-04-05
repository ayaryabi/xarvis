import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Use server-side auth helper
import { supabaseAdmin } from '@/lib/supabase/client'; // Import your Supabase admin client

export async function GET(request: Request) {
  try {
    // 1. Get the authenticated user ID from Clerk
    const { userId: clerkUserId } = auth(); // Note: Clerk uses userId, might differ from your Supabase users.id if not synced

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Step 1: Map Clerk User ID to Supabase User ID ---
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id') // Select the Supabase user ID
      .eq('clerk_id', clerkUserId) // Filter by Clerk ID
      .single(); // Expect only one user for this Clerk ID

    if (userError || !userData) {
      console.error(`[API/Channels] Error fetching Supabase user for Clerk ID ${clerkUserId}:`, userError);
      // Return a more specific error if user not found
      return NextResponse.json({ error: 'User mapping not found in database' }, { status: 404 }); 
    }
    const supabaseUserId = userData.id;
    console.log(`[API/Channels] Mapped Clerk ID ${clerkUserId} to Supabase User ID ${supabaseUserId}`);

    // --- Step 2: Get the user's org membership using Supabase User ID ---
    const { data: memberData, error: memberError } = await supabaseAdmin
       .from('organization_members')
       .select('organization_id')
       .eq('user_id', supabaseUserId) // USE supabaseUserId to filter org_members
       .limit(1)
       .maybeSingle();

     if(memberError || !memberData) {
       console.error("[API/Channels] Error finding org membership for Supabase User ID", supabaseUserId, memberError);
       // Keep the original error message here
       return NextResponse.json({ error: 'Cannot find user organization membership' }, { status: 404 }); 
     }
     const userOrgId = memberData.organization_id;
     console.log(`[API/Channels] User ${supabaseUserId} belongs to Org ${userOrgId}`);

    // 2. Query channels based on user's space membership
    // We need to join channels -> spaces -> space_members -> organization_members -> users
    // and filter by the user ID.
    const { data: channels, error } = await supabaseAdmin
      .from('channels')
      .select(`
        id,
        name,
        topic,
        created_at,
        space_id,
        spaces!inner (
          organization_id
        )
      `)
      .eq('spaces.organization_id', // Placeholder for joining logic - this simple eq is likely wrong
          // We need a subquery or join condition here based on membership
          // Let's try a more direct join approach based on RLS logic assumption
          // This might rely on RLS being correctly set up for the user making the request
          // OR we build the complex join manually.
          // Simpler (but potentially less secure if RLS bypassed/misconfigured):
          'spaces.organization_id' // This is just a placeholder, needs real logic
         )
      // --- Correct approach requires proper join/filter --- 
      // Example using joins (conceptual - Supabase JS syntax might differ slightly
      // or require an RPC call for complex joins):
      /*
      .select(`
        *,
        space:spaces!inner(*)
      `)
      .join('space_members', { foreignKey: 'space_id' })
      .join('organization_members', { foreignKey: 'member_id' })
      .eq('organization_members.user_id', actingUserId) // Filter by user ID
      */
     // --- Let's use an RPC function call as it's often cleaner for complex joins --- 
     // Assume you create a DB function `get_user_channels(user_uuid uuid)`
     /*
     const { data: channels, error } = await supabaseAdmin.rpc('get_user_channels', {
       user_uuid: actingUserId 
     });
     */
     
     // --- WORKAROUND FOR NOW: Select based on org assuming user is in default space --- 
     // This is NOT secure long term but gets MVP running before complex joins/RPC
     // 1. Get the user's org membership
     const { data: spaceIdsData, error: spaceIdsError } = await supabaseAdmin
        .from('spaces')
        .select('id') // Select only the id column
        .eq('organization_id', userOrgId);

      if (spaceIdsError) {
        console.error('[API/Channels] Error fetching space IDs:', spaceIdsError);
        throw spaceIdsError;
      }

      // Extract just the IDs into an array
      const spaceIds = spaceIdsData?.map(s => s.id) || [];

      // Ensure we have space IDs before querying channels
      if (spaceIds.length === 0) {
        console.log(`[API/Channels] No spaces found for org ${userOrgId}, returning empty channel list.`);
        return NextResponse.json([], { status: 200 }); // Return empty array if no spaces
      }

      // Now query channels using the fetched space IDs
      const { data: channelsData, error: channelsError } = await supabaseAdmin
        .from('channels')
        .select(`
          id,
          name,
          topic,
          space_id,
          created_at
        `)
        .in('space_id', spaceIds) // Use the array of space IDs here
        .order('name', { ascending: true });

      if (channelsError) {
        console.error('[API/Channels] Error fetching channels:', channelsError);
        throw channelsError; // Throw error to be caught below
      }

    console.log(`[API/Channels] Found ${channelsData?.length ?? 0} channels for org ${userOrgId}`);
    // Return the fetched channels
    return NextResponse.json(channelsData ?? [], { status: 200 });

  } catch (error: any) {
    console.error('[API/Channels] GET Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch channels' }, { status: 500 });
  }
} 