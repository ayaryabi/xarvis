# XARVIS Authentication Funnel

## Full Authentication Funnel (Big Picture)

1. **User Visits Application**:
   - Next.js middleware checks if route requires authentication
   - Protected routes redirect unauthenticated users to sign-in

2. **Authentication UI**:
   - User interacts with Clerk's sign-in/sign-up components
   - Clerk handles authentication logic (password validation, email verification)

3. **Successful Authentication**:
   - Clerk creates a session for the user
   - Clerk issues a JWT token stored in cookies
   - Clerk triggers a `user.created` event (for new users)

4. **Webhook Processing**:
   - Webhook handler receives the event
   - Verifies the event came from Clerk
   - For new users, creates records in the database:
     1. User record
     2. Organization record
     3. Organization membership (as admin)
     4. Free subscription plan assignment

5. **Application Access**:
   - User is authenticated in Clerk
   - Middleware allows access to protected routes
   - Components can access user data via Clerk hooks
   - Backend verifies user's identity via Clerk's JWT

6. **User Management**:
   - When users update their profile in Clerk, webhook events keep database in sync
   - Application maintains its own data model while leveraging Clerk's auth infrastructure
