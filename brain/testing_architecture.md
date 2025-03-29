# XARVIS Testing Architecture

## Table of Contents
- [Overview](#overview)
- [Testing Frameworks](#testing-frameworks)
- [Testing Structure](#testing-structure)
- [Test Types](#test-types)
- [Priority Areas for Testing](#priority-areas-for-testing)
- [Testing Utilities](#testing-utilities)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Implementation Roadmap](#implementation-roadmap)

## Overview

This document outlines a comprehensive testing strategy for XARVIS, a multi-tenant SaaS application for AI-powered ad campaign management. The testing architecture is designed to ensure robustness, maintainability, and confidence in code changes across the application's feature-based architecture.

## Testing Frameworks

Based on the Next.js with TypeScript architecture, we recommend the following testing frameworks:

1. **Jest** - Core testing framework
   - Provides the foundation for all tests
   - Handles test running, assertions, and mocking

2. **React Testing Library** - Component testing
   - For testing React components with a user-centric approach
   - Follows best practices for testing what users actually see and interact with

3. **Cypress** - End-to-end testing
   - For full application flow testing
   - Covers critical user journeys

4. **MSW (Mock Service Worker)** - API mocking
   - For mocking API responses in tests
   - Ensures tests run consistently without network dependencies

5. **Vitest** (Optional alternative to Jest)
   - Faster execution than Jest
   - Compatible with the same test syntax
   - Better integration with TypeScript

## Testing Structure

The testing structure should mirror the feature-based organization of the codebase:

```
src/
├── __tests__/                # E2E and integration tests
│   ├── e2e/                  # Cypress tests for critical flows
│   │   ├── auth.spec.ts
│   │   ├── channels.spec.ts
│   │   └── agents.spec.ts
│   └── integration/          # Cross-feature integration tests
│       ├── auth-channels.spec.ts
│       └── channels-agents.spec.ts
│
├── features/                 # Feature-specific tests
│   ├── auth/
│   │   ├── __tests__/        # Tests for auth feature
│   │   │   ├── components/   # Component tests
│   │   │   ├── hooks/        # Hook tests
│   │   │   └── stores/       # Store tests
│   │   └── ...
│   └── ...
│
├── components/              # UI component tests
│   ├── 0-ui/
│   │   ├── button/
│   │   │   ├── __tests__/
│   │   │   │   └── button.test.tsx
│   │   └── ...
│   └── ...
│
├── lib/                     # Utility tests
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── utils.test.ts
│   ├── supabase/
│   │   ├── __tests__/
│   │   │   ├── db.test.ts
│   │   │   └── auth.test.ts
│   └── ...
│
└── app/                    # API route tests
    ├── api/
    │   ├── __tests__/
    │   │   └── webhooks.test.ts
    └── ...
```

## Test Types

### 1. Unit Tests

Unit tests should focus on individual functions, hooks, and small components:

- **Scope**: Individual functions, hooks, or small components
- **Location**: Close to the code being tested (`__tests__` directories in each folder)
- **Tools**: Jest, React Testing Library
- **Best for**: Utils, custom hooks, pure functions, small UI components

### 2. Component Tests

Component tests focus on UI behavior and rendering:

- **Scope**: Individual UI components
- **Location**: `__tests__` directories adjacent to components
- **Tools**: React Testing Library, Jest
- **Best for**: Testing component rendering, user interactions, state changes

### 3. Integration Tests

Integration tests verify interactions between features:

- **Scope**: Multiple components or features working together
- **Location**: `src/__tests__/integration/`
- **Tools**: React Testing Library, MSW
- **Best for**: Testing feature interactions, data flow

### 4. E2E Tests

End-to-end tests cover complete user journeys:

- **Scope**: Entire application flows
- **Location**: `src/__tests__/e2e/`
- **Tools**: Cypress, Playwright
- **Best for**: Critical user journeys, regression testing

## Priority Areas for Testing

Based on the current codebase, here are the top priority areas for implementing tests, along with specific examples:

### 1. Core Utility Functions

**File**: `/src/lib/utils.ts`

This contains foundational utilities used throughout the application. Start with testing the `cn()` function:

```typescript
// src/lib/utils/__tests__/utils.test.ts
import { cn } from '../utils';

describe('cn (class names utility)', () => {
  it('merges class names correctly', () => {
    const result = cn('base-class', 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('merges tailwind classes properly', () => {
    const result = cn('text-red-500', 'text-lg', 'text-blue-500');
    // Should properly merge the conflicting text color classes
    expect(result).toBe('text-blue-500 text-lg');
  });
});
```

### 2. Supabase Database Layer

**File**: `/src/lib/supabase/db.ts`

The database layer contains critical functionality for data persistence. Use mocking to isolate tests from actual database calls:

```typescript
// src/lib/supabase/__tests__/db.test.ts
import { users, organizations, subscriptions, createUserWithOrganization } from '../db';
import { supabaseAdmin } from '../client';

// Mock the Supabase client
jest.mock('../client', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 'test-id', name: 'Test User' },
            error: null
          }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 'test-id', name: 'Test User' },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 'test-id', name: 'Updated User' },
              error: null
            }))
          }))
        }))
      }))
    })
  }
}));

describe('Supabase DB - Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user successfully', async () => {
    const userData = {
      clerk_id: 'clerk_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    const result = await users.create(userData);
    
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(result).toEqual(expect.objectContaining({
      id: 'test-id',
      name: 'Test User'
    }));
  });

  it('gets a user by clerk ID', async () => {
    const result = await users.getByClerkId('clerk_123');
    
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(result).toEqual(expect.objectContaining({
      id: 'test-id',
      name: 'Test User'
    }));
  });
});

describe('createUserWithOrganization', () => {
  beforeEach(() => {
    // Mock all the individual functions called by createUserWithOrganization
    jest.spyOn(users, 'create').mockResolvedValue({ id: 'user-1', name: 'Test User' });
    jest.spyOn(organizations, 'create').mockResolvedValue({ id: 'org-1', name: 'Test Organization' });
    jest.spyOn(organizations, 'addMember').mockResolvedValue({ id: 'member-1' });
    jest.spyOn(subscriptions, 'assignFreePlan').mockResolvedValue({ id: 'sub-1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user with organization and free plan', async () => {
    const userData = {
      clerk_id: 'clerk_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    const result = await createUserWithOrganization(userData);
    
    expect(users.create).toHaveBeenCalledWith(userData);
    expect(organizations.create).toHaveBeenCalledWith({
      name: "Test User's Organization"
    });
    expect(organizations.addMember).toHaveBeenCalledWith('org-1', 'user-1', 'admin');
    expect(subscriptions.assignFreePlan).toHaveBeenCalledWith('org-1');
    
    expect(result).toEqual({
      user: { id: 'user-1', name: 'Test User' },
      organization: { id: 'org-1', name: 'Test Organization' }
    });
  });
});
```

### 3. Authentication Helpers

**File**: `/src/lib/supabase/auth.ts`

Test the authentication helpers which are crucial for user management:

```typescript
// src/lib/supabase/__tests__/auth.test.ts
import { getOrCreateUser, updateUserProfile } from '../auth';
import { users } from '../db';

// Mock the users module from db.ts
jest.mock('../db', () => ({
  users: {
    getByClerkId: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

describe('Authentication Helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateUser', () => {
    it('returns existing user when found', async () => {
      const mockUser = {
        id: 'user-1',
        clerk_id: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User'
      };
      
      (users.getByClerkId as jest.Mock).mockResolvedValue(mockUser);
      
      const clerkUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      };
      
      const result = await getOrCreateUser(clerkUser);
      
      expect(users.getByClerkId).toHaveBeenCalledWith('clerk_123');
      expect(users.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('creates a new user when not found', async () => {
      const mockNewUser = {
        id: 'user-1',
        clerk_id: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User'
      };
      
      (users.getByClerkId as jest.Mock).mockResolvedValue(null);
      (users.create as jest.Mock).mockResolvedValue(mockNewUser);
      
      const clerkUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      };
      
      const result = await getOrCreateUser(clerkUser);
      
      expect(users.getByClerkId).toHaveBeenCalledWith('clerk_123');
      expect(users.create).toHaveBeenCalledWith({
        clerk_id: 'clerk_123',
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: undefined
      });
      expect(result).toEqual(mockNewUser);
    });
  });

  describe('updateUserProfile', () => {
    it('updates user profile when changes detected', async () => {
      const existingUser = {
        id: 'user-1',
        clerk_id: 'clerk_123',
        email: 'old@example.com',
        name: 'Old Name'
      };
      
      const updatedUser = {
        id: 'user-1',
        clerk_id: 'clerk_123',
        email: 'new@example.com',
        name: 'New Name'
      };
      
      (users.getByClerkId as jest.Mock).mockResolvedValue(existingUser);
      (users.update as jest.Mock).mockResolvedValue(updatedUser);
      
      const clerkUser = {
        id: 'clerk_123',
        emailAddresses: [{ emailAddress: 'new@example.com' }],
        firstName: 'New',
        lastName: 'Name'
      };
      
      const result = await updateUserProfile(clerkUser);
      
      expect(users.getByClerkId).toHaveBeenCalledWith('clerk_123');
      expect(users.update).toHaveBeenCalledWith('clerk_123', {
        email: 'new@example.com',
        name: 'New Name'
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
```

### 4. UI Component Testing

**File**: `/src/components/0-ui/button/index.tsx`

Test UI components to ensure they render correctly and handle interactions properly:

```typescript
// src/components/0-ui/button/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../index';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="white">White Button</Button>);
    let button = screen.getByRole('button');
    // We're checking classes instead of specific styling since styling comes from Tailwind
    expect(button.className).toContain('bg-white');
    
    rerender(<Button variant="gradient">Gradient Button</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('bg-gradient');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="lg">Large Button</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('text-lg');
    
    rerender(<Button size="xl">Extra Large Button</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('text-xl');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### 5. Clerk Webhook Handler

**File**: `/src/app/api/webhooks/clerk/route.ts`

The webhook handler is critical for user provisioning. Test it with simulated requests:

```typescript
// src/app/api/__tests__/webhooks.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../webhooks/clerk/route';
import { getOrCreateUser, updateUserProfile } from '@/lib/supabase/auth';
import { createUserWithOrganization } from '@/lib/supabase/db';
import { Webhook } from 'svix';

// Mock dependencies
jest.mock('svix', () => ({
  Webhook: jest.fn(() => ({
    verify: jest.fn().mockReturnValue({
      type: 'user.created',
      data: {
        id: 'clerk_123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
        image_url: 'https://example.com/avatar.png'
      }
    })
  }))
}));

jest.mock('@/lib/supabase/db', () => ({
  createUserWithOrganization: jest.fn().mockResolvedValue({
    user: { id: 'user-1', clerk_id: 'clerk_123' },
    organization: { id: 'org-1' }
  })
}));

jest.mock('@/lib/supabase/auth', () => ({
  getOrCreateUser: jest.fn(),
  updateUserProfile: jest.fn().mockResolvedValue({
    id: 'user-1',
    clerk_id: 'clerk_123'
  })
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: (name: string) => {
      const headers: Record<string, string> = {
        'svix-id': 'test-svix-id',
        'svix-timestamp': 'test-timestamp',
        'svix-signature': 'test-signature'
      };
      return headers[name] || null;
    }
  }))
}));

// Mock environment variable
process.env.CLERK_WEBHOOK_SECRET = 'test-secret';

describe('Clerk Webhook Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles user.created event correctly', async () => {
    // Create a mock request
    const mockRequest = new NextRequest('https://example.com/api/webhooks/clerk', {
      method: 'POST',
      body: JSON.stringify({
        type: 'user.created',
        data: {
          id: 'clerk_123',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'Test',
          last_name: 'User',
          image_url: 'https://example.com/avatar.png'
        }
      })
    });

    // Set up verification to return user.created event
    (Webhook.prototype.verify as jest.Mock).mockReturnValue({
      type: 'user.created',
      data: {
        id: 'clerk_123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
        image_url: 'https://example.com/avatar.png'
      }
    });

    const response = await POST(mockRequest);
    
    expect(Webhook.prototype.verify).toHaveBeenCalled();
    expect(createUserWithOrganization).toHaveBeenCalledWith({
      clerk_id: 'clerk_123',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    });
    expect(response.status).toBe(200);
  });

  it('handles user.updated event correctly', async () => {
    // Create a mock request
    const mockRequest = new NextRequest('https://example.com/api/webhooks/clerk', {
      method: 'POST',
      body: JSON.stringify({
        type: 'user.updated',
        data: {
          id: 'clerk_123',
          email_addresses: [{ email_address: 'updated@example.com' }],
          first_name: 'Updated',
          last_name: 'User',
          image_url: 'https://example.com/updated-avatar.png'
        }
      })
    });

    // Set up verification to return user.updated event
    (Webhook.prototype.verify as jest.Mock).mockReturnValue({
      type: 'user.updated',
      data: {
        id: 'clerk_123',
        email_addresses: [{ email_address: 'updated@example.com' }],
        first_name: 'Updated',
        last_name: 'User',
        image_url: 'https://example.com/updated-avatar.png'
      }
    });

    const response = await POST(mockRequest);
    
    expect(Webhook.prototype.verify).toHaveBeenCalled();
    expect(updateUserProfile).toHaveBeenCalledWith({
      id: 'clerk_123',
      emailAddresses: [{ emailAddress: 'updated@example.com' }],
      firstName: 'Updated',
      lastName: 'User',
      imageUrl: 'https://example.com/updated-avatar.png'
    });
    expect(response.status).toBe(200);
  });
});
```

## Testing Utilities

### 1. Test Helpers

Create shared test utilities to enhance productivity:

```typescript
// src/lib/test-utils/index.ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

function customRender(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    // Add any necessary providers here (e.g., for Zustand stores)
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
```

### 2. Mock Data Factory

Create factories for test data:

```typescript
// src/lib/test-utils/factories.ts
import { User, Organization } from '@/lib/supabase/types';

export function createMockUser(overrides = {}): User {
  return {
    id: 'user-1',
    clerk_id: 'clerk_123',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockOrganization(overrides = {}): Organization {
  return {
    id: 'org-1',
    name: 'Test Organization',
    settings: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}
```

### 3. Supabase Mocking Utility

```typescript
// src/lib/test-utils/supabase-mock.ts
export function createSupabaseMock() {
  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        })),
        is: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        })),
        in: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        })),
        match: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        })),
        single: jest.fn(() => ({
          data: null,
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: null
            }))
          }))
        }))
      }))
    }))
  };
}
```

## CI/CD Integration

Integrate testing into the CI/CD pipeline:

1. **GitHub Actions Workflow**

```yaml
name: Test
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
    
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
```

2. **Pre-commit Hooks**

Use Husky to set up pre-commit hooks:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "jest --findRelatedTests"
    ]
  }
}
```

## Best Practices

### 1. Component Testing Strategy

- **Test the component's API**: Focus on testing props, callbacks, and state changes
- **Test user interactions**: Click, hover, input changes
- **Avoid implementation details**: Don't test internal methods or state directly
- **Test accessibility**: Check that components work with keyboard and screen readers

### 2. Testing Principles

- **Write tests that resemble user behavior**
- **Test behavior, not implementation**
- **Avoid unnecessary test doubles (mocks, stubs) when possible**
- **Keep tests simple and focused**
- **Use the appropriate level of testing for each component**

### 3. Feature Testing Approach

For each feature, aim to cover:

- **Happy paths**: The common, successful use cases
- **Edge cases**: Unusual but valid inputs or scenarios
- **Error states**: User errors, system failures, network issues

### 4. Test Organization

- **Arrange, Act, Assert pattern**:
  - Arrange: Set up the test scenario
  - Act: Perform the action being tested
  - Assert: Verify the expected outcome

- **Consistent naming conventions**:
  ```
  describe('ComponentName', () => {
    describe('when [condition]', () => {
      it('should [expected behavior]', () => {
        // test code
      });
    });
  });
  ```

## Implementation Roadmap

### Phase 1: Foundation (Current Focus)
- Set up Jest and React Testing Library
- Add core utility functions tests (`cn` utility)
- Create test utilities and mock data factories
- Set up basic CI pipeline for running tests

### Phase 2: Database & Authentication Layer
- Add tests for Supabase database operations
- Test authentication helpers
- Test Clerk webhook handler
- Implement MSW for API mocking

### Phase 3: UI Component Testing
- Add tests for core UI components (Button, Card, etc.)
- Create snapshot tests for key components
- Test component interactions and state changes
- Implement accessibility testing

### Phase 4: Feature Integration
- Add integration tests between features
- Test data flow between components
- Test state management

### Phase 5: E2E Testing
- Set up Cypress for end-to-end testing
- Implement tests for critical user journeys
- Add cross-browser testing with Playwright