'use client';

// React/Next.js Imports
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Added usePathname

// Clerk Auth
import { useAuth } from '@clerk/nextjs';

// Subscription Components & API
import { PricingTable } from "@/features/subscription/components/PricingTable";
import { createCheckoutSession } from '@/features/subscription/api/checkout-api';

// Optional: Add layout/styling if needed, e.g., a container
// import { Container } from '@/components/layout/container'; 

export default function PricingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // Get current path for cleaning URL
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log initial search params on render
  console.log('[PricingPage] Rendering. Initial searchParams:', searchParams.toString());

  // Get action and priceId from search params *outside* the effect
  const action = searchParams.get('action');
  const priceId = searchParams.get('priceId');

  useEffect(() => {
    // Wait for Clerk to load before checking auth status
    if (!isLoaded) {
      console.log('[PricingPage] Waiting for Clerk auth to load...');
      return; // Exit effect if Clerk is not loaded yet
    }

    // Log the specific values being checked
    console.log('[PricingPage] Clerk loaded. Checking conditions:', { 
      isLoaded,
      isSignedIn, 
      action, 
      priceId 
    });

    // Check if user just signed in and intended to checkout on this page
    if (isSignedIn && action === 'checkout' && priceId) {
      console.log('[PricingPage] Auto-checkout conditions met. Price ID:', priceId);
      setIsLoading(true);
      setError(null);

      // Immediately remove query params to prevent re-trigger on potential re-renders
      // Do this *before* the async call
      router.replace(pathname, undefined);

      createCheckoutSession(priceId)
        .then((url) => {
          if (url) { // Check if URL is valid before redirecting
            console.log('[PricingPage] Auto-checkout session created. Redirecting to:', url);
            window.location.href = url;
          } else {
             // Handle case where API might return null/undefined URL unexpectedly
             console.error('[PricingPage] Auto-checkout failed: Received invalid URL from API.');
             setError('Checkout failed: Could not retrieve checkout URL.');
             setIsLoading(false);
          }
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('[PricingPage] Auto-checkout failed:', message);
          setError(`Checkout failed: ${message}`);
          setIsLoading(false);
        });
    } else {
        // Log why the condition failed if Clerk is loaded
        console.log('[PricingPage] Auto-checkout conditions not met or already processed.');
    }
    // Rerun effect only if the relevant conditions or loaded state change
  }, [isLoaded, isSignedIn, action, priceId, router, pathname]);

  return (
    // Optional: Wrap in a container or add padding/margins
    <div className="py-12 md:py-20">
      {/* Optional: Display Loading/Error State */}
      {isLoading && <p className="text-center">Processing checkout...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!isLoaded && <p className="text-center">Loading authentication...</p>} {/* Optional: Indicate loading */} 

      {/* Render the pricing table */}
      {isLoaded && <PricingTable />} {/* Optionally delay rendering table until auth loaded */}
    </div>
  );
} 