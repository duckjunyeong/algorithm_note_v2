```markdown
You are an expert in TypeScript, React, Shadcn UI, Radix UI, and Tailwind.

### Code Style and Structure
*   Write concise, technical TypeScript code with accurate examples.
*   Use functional and declarative programming patterns; avoid classes.
*   Prefer iteration and modularization over code duplication.
*   Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
*   Structure files: exported component, subcomponents, helpers, static content, types.

### Component Architecture: View-Logic Separation
Principle: All components must separate presentation (View) from business logic (Logic) using a custom hook pattern. This enhances reusability, testability, and maintainability.

*   **View Component (`*.view.tsx`):**
    *   **Responsibility:** Renders the UI based on props. It should be a "dumb" component.
    *   **Contains:** JSX, styling via `className`.
    *   **Avoids:** State (`useState`), side effects (`useEffect`), data fetching, or complex event handling logic.

*   **Logic Hook (`use*.ts`):**
    *   **Responsibility:** Manages all state, side effects, data fetching, and event handlers related to the component.
    *   **Returns:** An object containing the values and functions that the View component needs to render and operate.

*   **Container Component (`index.tsx`):**
    *   **Responsibility:** Connects the Logic Hook to the View Component. It calls the hook and passes the returned values as props to the View. This is the main exported component.

**Example Structure:** For a `UserProfile` component:

`libs/ui-components/src/components/user-profile/useUserProfile.ts` (Logic Hook)

```typescript
import { useState, useEffect } from 'react';
// Manages state and data fetching.
export function useUserProfile(userId: string) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data...
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setIsLoading(false);
      });
  }, [userId]);

  return { user, isLoading };
}
```

`libs/ui-components/src/components/user-profile/UserProfile.view.tsx` (View Component)

```typescript
// Purely for presentation. Receives all data and functions as props.
interface UserProfileViewProps {
  isLoading: boolean;
  user: { name: string; email: string } | null;
}

export function UserProfileView({ isLoading, user }: UserProfileViewProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-500">{user.email}</p>
    </div>
  );
}
```

`libs/ui-components/src/components/user-profile/index.tsx` (Container)

```typescript
import { useUserProfile } from './useUserProfile';
import { UserProfileView } from './UserProfile.view';

// Connects logic to the view and is exported for use in the app.
interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading } = useUserProfile(userId);

  return <UserProfileView user={user} isLoading={isLoading} />;
}
```

### Naming Conventions
*   Use lowercase with dashes for directories (e.g., `components/auth-wizard`).
*   Favor named exports for components.

### TypeScript Usage
*   Use TypeScript for all code; prefer interfaces over types.
*   Avoid enums; use maps instead.
*   Use functional components with TypeScript interfaces.
*   **Component Typing:** Do NOT use `React.FC` or `FC` types. Instead, directly type the props parameter for better type inference and flexibility.
*   **Type Imports:** Always use `import type` when importing TypeScript types, interfaces, or type-only constructs to distinguish them from runtime imports.

### Syntax and Formatting
*   Use the "function" keyword for pure functions.
*   Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
*   Use declarative JSX.

### UI and Styling
*   Use Shadcn UI, Radix, and Tailwind for components and styling.
*   **Single Source of Truth:** Always reference the `/theme/theme.js` file as the single source of truth for design tokens (colors, spacing, fonts, etc.) when applying styles with Tailwind.
*   Implement responsive design with Tailwind CSS; use a mobile-first approach.

### Performance Optimization
*   Minimize `'use client'`, `useEffect`, and `setState`; favor React Server Components (RSC).
*   Wrap client components in `Suspense` with `fallback`.
*   Use dynamic loading for non-critical components.
*   Optimize images: use WebP format, include size data, implement lazy loading.

### Dependency Management
*   **Mandatory Library Registration**: Before importing any external library in your code, you MUST first verify that the library is listed in the `dependencies` or `devDependencies` of the current package's `package.json` file.
*   **Auto-Addition Rule**: If a required library is not present in the package's `package.json`, you MUST add it with the correct version from the library version table before writing any import statements.
*   **Package Scope Verification**: Each package (apps/dashboard, apps/landing-page, libs/ui-components, etc.) maintains its own dependencies. A library available in one package is not automatically available in another.
*   **Import Prevention**: Never import libraries that are not explicitly declared in the current package's dependencies. This prevents runtime errors and maintains proper dependency management.

### Key Conventions
*   Use `'nuqs'` for URL search parameter state management.
*   Optimize Web Vitals (LCP, CLS, FID).
*   Limit `'use client'`:
    *   Favor server components and Next.js SSR.
    *   Use only for Web API access in small components.
    *   Avoid for data fetching or state management.
*   Follow Next.js docs for Data Fetching, Rendering, and Routing.
```