import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  // In a real app, you might want more robust error handling or logging here.
  // For server-side code, throwing an error might be appropriate.
  // For client-side code accessible stuff (like publishable key), return null or undefined.
  console.error("Stripe secret key is not set in environment variables.");
  // Depending on usage, you might throw or handle this differently.
  // Throwing here will prevent the app from starting if the key is missing server-side.
  // throw new Error('Stripe secret key is missing');
}

// Initialize Stripe with the API key and specify the API version.
// It's recommended to pin the API version to ensure stability.
export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-02-24.acacia', // Update API version based on linter error
  typescript: true, // Enable TypeScript support
});
