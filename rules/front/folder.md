**Task 1: Create New UI Components**
[IMPORTANT] This rule applies to all UI components in the project.

Rule: All new UI components, from general-purpose components like reusable buttons and avatars to layout components like headers and sidebars, must be created under the `libs/ui-components/src` folder. Never create UI component files under `apps/*` folders.

Path: `libs/ui-components/src/components/`

Action:

1.  Create a new folder with the name of the component to be created. (e.g., Button)
2.  Create an `index.tsx` file within that folder to write the component code.
3.  Apply styling using Tailwind CSS utility classes via the `className` prop.

Example: For "create Header component" or "create Spinner component" requests, write the code in `libs/ui-components/src/components/Header/index.tsx` and `libs/ui-components/src/components/Spinner/index.tsx` respectively.

**Task 2: Add New Page (Route)**
Scope: Applies only to application packages like `apps/dashboard`, `apps/landing-page`.

Path: `apps/[appName]/src/pages/`

Action:

1.  Create a folder with the page name. (e.g., MyPage)
2.  Write the main logic and layout of the page in the `index.tsx` file within that folder.
3.  Pages should be composed by combining components from `libs/ui-components`.

Example: For "add MyPage to dashboard" request, create `apps/dashboard/src/pages/MyPage/index.tsx` and write the relevant logic.

**Task 3: API Integration and Data Management**
Scope: Applies only to application packages that require actual API communication, such as `apps/dashboard`.

**3-1. Add API Call Functions:**

Path: `apps/[appName]/src/services/` (or `src/api/`)

Action: Separate files by functionality (e.g., `userService.ts`). All network request code using axios must be located in this folder.

**3-2. API Data Validation (Zod):**

Path: `apps/[appName]/src/schemas/`

Action: Create Zod schema files by feature/data model, such as `user.schema.ts`, and infer TypeScript types using `z.infer`, then export them together.

**3-3. Global State Management (Zustand):**

Path: `apps/[appName]/src/store/`

Action: Create custom hook files by functionality, such as `useUserStore.ts`.

**Task 4: Other Logic and Type Additions**
Scope: Primarily applies to `apps/*` packages, but some may also apply to `libs/core-logic`.

**4-1. Create Custom Hooks:**

Path: `apps/[appName]/src/hooks/`

Action: Create hook files starting with `use`. (e.g., `useWindowSize.ts`)

**4-2. Define Internal Types (without Zod):**

Path: `apps/[appName]/src/types/`

Action: Only pure TypeScript types (interface, type) that do not require runtime validation should be defined here. (Common API types are located in `libs/api-types`).

**4-3. Add Constant Values:**

Path: `apps/[appName]/src/constants/`

Action: Define constants in files appropriate for their purpose, such as `path.ts` (routing paths), `messages.ts` (notification messages).

**4-4. Add Pure Utility Functions:**

Path: `libs/core-logic/src/` or `apps/[appName]/src/utils/`

Action: General-purpose pure functions (e.g., `formatDate`) that will be used throughout the project should be written in `libs/core-logic`. Utilities used only within a specific app should be written in that app's `utils` folder.