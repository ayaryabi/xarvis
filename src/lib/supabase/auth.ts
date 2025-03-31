import { users } from './db';
import type { User } from './types';

/**
 * Get a user by their Clerk ID, creating one if they don't exist
 */
export async function getOrCreateUser(clerkUser: {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}): Promise<User> {
  try {
    const existingUser = await users.getByClerkId(clerkUser.id);
    
    if (existingUser) {
      return existingUser;
    }
    
    // User doesn't exist, create them
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) {
      throw new Error('User must have an email address');
    }
    
    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ') || 'Unnamed User';
    
    const newUser = await users.create({
      clerk_id: clerkUser.id,
      email: primaryEmail,
      name: fullName,
      avatar_url: clerkUser.imageUrl,
    });
    
    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
}

/**
 * Update a user's Supabase record when their Clerk profile changes
 */
export async function updateUserProfile(clerkUser: {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}): Promise<User | null> {
  try {
    const existingUser = await users.getByClerkId(clerkUser.id);
    
    if (!existingUser) {
      return null;
    }
    
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ');
    
    const updates: Record<string, string> = {};
    
    if (primaryEmail && primaryEmail !== existingUser.email) {
      updates.email = primaryEmail;
    }
    
    if (fullName && fullName !== existingUser.name) {
      updates.name = fullName;
    }
    
    if (clerkUser.imageUrl && clerkUser.imageUrl !== existingUser.avatar_url) {
      updates.avatar_url = clerkUser.imageUrl;
    }
    
    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      return await users.update(clerkUser.id, updates);
    }
    
    return existingUser;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
} 