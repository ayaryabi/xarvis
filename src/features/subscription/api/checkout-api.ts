/**
 * Calls the backend API (/api/checkout) to create a Stripe Checkout Session.
 *
 * @param priceId - The ID of the Stripe Price the user wants to subscribe to.
 * @returns The URL for the Stripe Checkout page to redirect the user to.
 * @throws Throws an error if the API call fails, returns an error status, 
 *         or doesn't return the expected URL structure.
 */
export async function createCheckoutSession(priceId: string): Promise<string> {
  console.log(`[checkout-api] Requesting session for priceId: ${priceId}`);

  if (!priceId) {
    throw new Error('Price ID is required to create a checkout session.');
  }

  try {
    const response = await fetch('/api/checkout', { // Call our backend endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }), // Send the priceId
    });

    // Check if the request was successful
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        // Try to parse a potential JSON error body from the backend
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage; // Use backend message if available
      } catch (parseError) {
        // Ignore if the error body isn't valid JSON
        console.warn('[checkout-api] Could not parse error response body.');
      }
      console.error('[checkout-api] API Error Response:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse the successful JSON response
    const data = await response.json();

    // Check if the expected URL is present
    if (!data.url || typeof data.url !== 'string') {
      console.error('[checkout-api] API response missing or invalid URL:', data);
      throw new Error('API response did not contain a valid checkout URL.');
    }

    console.log('[checkout-api] Received checkout URL successfully.');
    return data.url; // Return the URL

  } catch (error) {
    console.error('[checkout-api] Error creating checkout session:', error);
    // Re-throw the error so the calling component (e.g., CheckoutButton) can handle it
    // Ensure it's always an Error object
    throw error instanceof Error ? error : new Error('An unexpected error occurred during checkout session creation.');
  }
}
