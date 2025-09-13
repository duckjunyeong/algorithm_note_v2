You are an AI assistant helping with the front-end development of the project. When asked to write or modify code, you must strictly adhere to the following core rules and library usage guidelines.

**Core Rules**

*   **Prioritize Designated Libraries:** For tasks explicitly mentioned in the "Library Usage Guide" below, you must use only the specified libraries. Do not arbitrarily use other libraries.
*   **Automatic Dependency Addition:** When a library listed in the "Library Version Table" needs to be used in a specific package (e.g., dashboard, ui-components), and if that library is not present in the package's `package.json`, you must first add it to `dependencies` or `devDependencies` with the specified version before writing any code.
*   **Propose New Libraries:** If a feature not covered by the guide is required, do not arbitrarily install new libraries. Instead, explain the situation to the user, recommend the most suitable library, and ask for permission to install it.
    *   Example: "It seems an alert (Toast UI) feature is needed. The `sonner` library can easily implement clean notifications. Should I proceed with the installation?"

**Library Version Table**

| Library               | Version     | Primary Usage Location (Package)       | Category      |
| :-------------------- | :---------- | :------------------------------------- | :------------ |
| react                 | ^19.1.1     | dashboard, landing-page, ui-components | dependencies  |
| react-dom             | ^19.1.1     | dashboard, landing-page, ui-components | dependencies  |
| tailwindcss           | ^3.4.6      | (root)                                 | devDependencies |
| @tanstack/react-query | ^5.51.15    | dashboard                              | dependencies  |
| zustand               | ^4.5.4      | dashboard                              | dependencies  |
| axios                 | ^1.7.2      | dashboard                              | dependencies  |
| react-router-dom      | ^6.25.1     | dashboard, landing-page                | dependencies  |
| @clerk/clerk-react    | ^5.2.8      | dashboard, landing-page                | dependencies  |
| react-hook-form       | ^7.52.1     | dashboard                              | dependencies  |
| zod                   | ^3.23.8     | dashboard, core-logic                  | dependencies  |
| recharts              | ^2.12.7     | dashboard                              | dependencies  |
| reactflow             | ^11.11.4    | dashboard                              | dependencies  |
| lucide-react          | ^0.417.0    | dashboard, landing-page                | dependencies  |
| framer-motion         | ^11.3.19    | landing-page                           | dependencies  |
| clsx                  | ^2.1.1      | ui-components                          | dependencies  |
| tailwind-merge        | ^2.4.0      | ui-components                          | dependencies  |
| date-fns              | ^3.6.0      | core-logic                             | dependencies  |
| @storybook/react      | ^8.2.6      | ui-components                          | devDependencies |

**Library Usage Guide**

**Styling and UI**

*   All component styles should be written using **tailwindcss** for utility-class-based styling. Avoid CSS-in-JS or separate CSS files.
*   When icons are needed, use the **lucide-react** library.
*   UI elements (buttons, cards, input fields, etc.) that are repeatedly used across multiple pages should be created as reusable components within the `libs/ui-components` package.
*   When conditionally combining Tailwind classes, use **clsx** and **tailwind-merge** together to prevent class conflicts and duplication.
*   Smooth UI animations and interactions should be implemented using **framer-motion** (primarily for `landing-page`).

**State Management and Data Communication**

*   All API requests and response handling with the backend server should use **axios**.
*   Caching, re-fetching, loading, and error state management for data received from the server (Server State) should use **@tanstack/react-query**. Do not manage server data directly with `useState`.
*   Client-side state (e.g., dark mode settings, modal open status) that needs to be shared across multiple components should be managed using **zustand**.

**Routing and Authentication**

*   Page navigation and URL management for the web application should use **react-router-dom**.
*   User registration, login, and session management should use the components and hooks provided by **@clerk/clerk-react**.

**Forms and Validation**

*   User input forms should use **react-hook-form** to manage state and submission logic.
*   All data (form inputs, API responses, etc.) should have its type and validation performed by defining **zod** schemas.

**Data Visualization**

*   Bar, pie, and line graphs, such as those for learning statistics dashboards, should be implemented using **recharts**.
*   Complex diagrams consisting of nodes and edges, like algorithm solution flows, should use **reactflow**.

**Utility Logic**

*   All date and time formatting, calculations, and related logic should use **date-fns**.
*   Pure function logic that is independent of React and can be commonly used across multiple applications should be written in `libs/core-logic`.