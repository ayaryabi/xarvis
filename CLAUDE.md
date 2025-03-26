# Xarvis Development Guide

## Commands
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Start Production:** `npm run start`
- **Lint:** `npm run lint`

## Code Style Guidelines
- **Framework:** Next.js with App Router and TypeScript
- **Component Structure:** Functional components with TypeScript interfaces
- **Naming:** PascalCase for components, camelCase for variables/functions
- **Imports:** Use path aliases (`@/lib/utils` instead of relative paths)
- **Client Components:** Use `"use client"` directive for client components
- **Styling:** Tailwind CSS with `cn()` utility for class merging
- **Types:** Strict TypeScript, prefer explicit types over inference
- **Error Handling:** Try/catch with error logging, rethrow when necessary
- **UI Components:** Follow existing patterns in `/src/components/ui`
- **State Management:** React hooks for local state, Supabase for backend
- **Authentication:** Clerk for authentication and user management

## Project Organization
- UI components in `/src/components/ui`
- Page-specific components in `/src/components/pages`
- Reusable hooks in `/src/hooks`
- Utility functions in `/src/lib`
- Database client in `/src/lib/supabase`