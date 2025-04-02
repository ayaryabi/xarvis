import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhooks",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/refactor",
    "/privacy",
    "/terms",
    "/data-deletion",
    "/pricing",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 