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

// Use the explicit API version from environment or fallback
// Align this with your Stripe webhook endpoint version if issues arise
const apiVersion = process.env.STRIPE_API_VERSION || '2024-09-30.acacia'; // <-- Update this version

console.log(`Initializing Stripe client with API version: ${apiVersion}`);

// Initialize Stripe with the API key and specify the API version.
// It's recommended to pin the API version to ensure stability.
export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: apiVersion as Stripe.LatestApiVersion, // Cast needed by Stripe type
  typescript: true, // Enable TypeScript support
});
