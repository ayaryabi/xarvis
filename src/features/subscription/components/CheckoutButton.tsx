'use client'; // Required for onClick and useState

import React, { useState } from 'react';
import { createCheckoutSession } from '../api/checkout-api'; // Import the helper
import { Button } from "@/components/ui/button/index"; // Import your styled Button
import { Loader2 } from 'lucide-react'; // Assuming you use lucide for icons
import { useAuth } from "@clerk/nextjs"; // <-- Import useAuth
import { useRouter } from 'next/navigation'; // <-- Import useRouter

interface CheckoutButtonProps {
  priceId: string; // Expect the Price ID as a prop
  children?: React.ReactNode;
  // Allow passing standard Button props like className, variant, etc.
  className?: string;
  variant?: "outline" | "ghost" | "white" | "gradient" | undefined;
  size?: "default" | "lg" | "xl" | "full"; // <-- Ensure size prop definition exists
}

/**
 * Button component for initiating Stripe Checkout.
 * Handles logged-in state and redirects appropriately.
 */
export function CheckoutButton({
  priceId,
  children,
  className,
  variant = "white", // Default to white variant like original button
  size, // <-- Ensure size prop is received
  ...props // Pass rest of the props to the underlying Button
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null); // To display result/error
  const { isSignedIn } = useAuth(); // <-- Get sign-in status
  const router = useRouter(); // <-- Get router instance

  const handleCheckout = async () => { // Renamed from handleTestCheckout
    // 1. Check if user is signed in
    if (!isSignedIn) {
      console.log('[CheckoutButton] User not signed in. Redirecting to sign-up with checkout intent for /pricing.');
      // Construct the final return URL *with* the necessary query parameters
      const returnUrl = `/pricing?action=checkout&priceId=${priceId}`;
      // Construct the Clerk sign-up URL, encoding the *full* return URL
      const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(returnUrl)}`;
      console.log('[CheckoutButton] Constructed sign-up URL:', signUpUrl);
      router.push(signUpUrl);
      return; // Stop execution
    }

    // 2. Proceed if signed in
    setIsLoading(true);
    setResult(null); 
    console.log(`[CheckoutButton] Attempting checkout for priceId: ${priceId}`);

    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      console.log('[CheckoutButton] Success! Redirecting to Checkout URL:', checkoutUrl);
      // 3. Redirect to Stripe on success
      window.location.href = checkoutUrl; 

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[CheckoutButton] Checkout failed:', message);
      // Keep showing basic error message for now
      setResult(`Error: ${message}`); 
      // TODO: Implement user-friendly error display (e.g., toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Use the imported Button component */}
      <Button
        onClick={handleCheckout} // Use the updated handler
        disabled={isLoading}
        variant={variant} // Apply the variant
        size={size} // <-- Ensure size prop is passed down
        // Combine passed className with default rounded-lg (if needed)
        // Adjust this based on where rounded-lg was originally applied
        className={`rounded-lg ${className || ''}`.trim()} 
        {...props} // Pass other props
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children || 'Checkout'}
      </Button>
      {result && (
        <p style={{ marginTop: '10px', wordBreak: 'break-all' }}>
          Result: {result}
        </p>
      )}
    </div>
  );
}
