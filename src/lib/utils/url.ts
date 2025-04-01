/**
 * Dynamically determines the base URL of the application based on environment variables.
 * Prioritizes Vercel deployment URLs, then a custom APP_URL, and defaults to localhost.
 */
export function getBaseUrl(): string {
  // 1. Check for Vercel deployment URL (VERCEL_URL is provided automatically)
  if (process.env.VERCEL_URL) {
    // Vercel URL doesn't include the protocol, so add https
    return `https://${process.env.VERCEL_URL}`;
  }

  // 2. Check for a custom environment variable (e.g., for other hosting or local setup)
  // Use NEXT_PUBLIC_APP_URL if available client-side, or APP_URL server-side.
  // Ensure this is set in your .env files (e.g., APP_URL=http://localhost:3000)
  // For server-side usage, prefer a non-public variable like APP_URL.
  // For simplicity here, we'll just check process.env.APP_URL assuming server-side usage.
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  // 3. Default for local development
  // Ensure your local development server runs on port 3000, or adjust this.
  return 'http://localhost:3000';
} 