'use client'; // Required for onClick and useState

import React, { useState } from 'react';
import { createCheckoutSession } from '../api/checkout-api'; // Import the helper
import { Button } from "@/components/ui/button/index"; // Import your styled Button
import { Loader2 } from 'lucide-react'; // Assuming you use lucide for icons

interface CheckoutButtonProps {
  priceId: string; // Expect the Price ID as a prop
  children?: React.ReactNode;
  // Allow passing standard Button props like className, variant, etc.
  className?: string;
  variant?: "outline" | "ghost" | "white" | "gradient" | undefined;
}

/**
 * Simple Checkout Button for testing Phase 2a.
 * Uses the styled Button component.
 * Assumes user is logged in.
 * Logs the checkout URL or error to the console instead of redirecting.
 */
export function CheckoutButton({
  priceId,
  children,
  className,
  variant = "white", // Default to white variant like original button
  ...props // Pass rest of the props to the underlying Button
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null); // To display result/error

  const handleTestCheckout = async () => {
    setIsLoading(true);
    setResult(null); // Clear previous result
    console.log(`[Test CheckoutButton] Attempting checkout for priceId: ${priceId}`);

    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      console.log('[Test CheckoutButton] Success! Checkout URL:', checkoutUrl);
      setResult(`Success! URL: ${checkoutUrl}`);
      // In real version, redirect: window.location.href = checkoutUrl;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Test CheckoutButton] Checkout failed:', message);
      setResult(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Use the imported Button component */}
      <Button
        onClick={handleTestCheckout}
        disabled={isLoading}
        variant={variant} // Apply the variant
        // Combine passed className with default rounded-lg (if needed)
        // Adjust this based on where rounded-lg was originally applied
        className={`rounded-lg ${className || ''}`.trim()} 
        {...props} // Pass other props
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children || 'Test Checkout'}
      </Button>
      {result && (
        <p style={{ marginTop: '10px', wordBreak: 'break-all' }}>
          Result: {result}
        </p>
      )}
    </div>
  );
}
