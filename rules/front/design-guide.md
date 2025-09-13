```markdown
## Linear-Inspired Design System

This design system is built on the core values of professionalism, clarity, and minimalism. Its goal is to minimize unnecessary visual elements, allowing users to focus entirely on their tasks, and to provide a consistent user experience.

### 1. Colors

The color system is clearly defined by functional roles. All colors have been selected with readability and accessibility in mind, providing a consistent experience across both Light and Dark modes.

**Light Mode**

| Role      | Token                     | Hex Code   | Primary Use Case                                   |
| :-------- | :------------------------ | :--------- | :------------------------------------------------- |
| Primary   | `colors.primary.blue`     | `#5e6ad2`  | Core CTAs, active states, focus rings, links       |
|           | `colors.primary.blueHover`| `#4c5bd4`  | Hover state for Primary elements                   |
|           | `colors.primary.blueLight`| `#e8eafd`  | Background for selected items, subtle highlights   |
| Background| `colors.background.primary`| `#ffffff`  | The default background of pages                    |
|           | `colors.background.secondary`| `#f6f8fa` | Background for subtle separations like cards and sections |
|           | `colors.background.tertiary`| `#f1f3f4` | Background for hover or active states              |
| Text      | `colors.text.primary`     | `#0d1117`  | Core text for headings and body content            |
|           | `colors.text.secondary`   | `#656d76`  | Supplementary info, placeholders, disabled text    |
|           | `colors.text.tertiary`    | `#8b949e`  | Text with the lowest priority (e.g., footers)      |
| Border    | `colors.border.primary`   | `#d0d7de`  | Default border for components                      |
|           | `colors.border.secondary` | `#e1e8ed`  | Subtle dividing lines                              |
| Semantic  | `colors.semantic.success` | `#28a745`  | Success, completed states                          |
|           | `colors.semantic.warning` | `#ffc107`  | Warning, caution states                            |
|           | `colors.semantic.error`   | `#dc3545`  | Error, failed states                               |
|           | `colors.semantic.info`    | `#17a2b8`  | Informational messages                             |

**Dark Mode**

| Role      | Token                       | Hex Code   | Primary Use Case                                   |
| :-------- | :-------------------------- | :--------- | :------------------------------------------------- |
| Background| `darkMode.background.primary`| `#0d1117`  | The default background of pages                    |
|           | `darkMode.background.secondary`| `#161b22` | Background for subtle separations like cards and sections |
|           | `darkMode.background.tertiary`| `#21262d` | Background for hover or active states              |
| Text      | `darkMode.text.primary`     | `#f0f6fc`  | Core text for headings and body content            |
|           | `darkMode.text.secondary`   | `#8b949e`  | Supplementary info, placeholders, disabled text    |
|           | `darkMode.text.tertiary`    | `#656d76`  | Text with the lowest priority (e.g., footers)      |
| Border    | `darkMode.border.primary`   | `#30363d`  | Default border for components                      |
|           | `darkMode.border.secondary` | `#21262d`  | Subtle dividing lines                              |

### 2. Typography

We use system-native fonts to prioritize readability and clarity. This provides users with the most familiar experience and clearly communicates the information hierarchy.

*   `fontFamily.primary`: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
    *   Prioritizes the OS's default system font to ensure optimal readability and performance.
*   `fontFamily.mono`: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', ...`
    *   Used when a monospace font is needed, such as for code blocks or numerical data.

| Property  | Token           | Value  | Usage Guide                                     |
| :-------- | :-------------- | :----- | :---------------------------------------------- |
| Font Size | `fontSize.sm`   | `14px` | Meta information, small labels                  |
|           | `fontSize.base` | `16px` | Standard body text                              |
|           | `fontSize.lg`   | `18px` | Subheadings, emphasized text                    |
|           | `fontSize.xl`   | `20px` | Section titles                                  |
|           | `fontSize.2xl`  | `24px` | Page titles                                     |
| Font Weight| `fontWeight.normal`| `400`  | Body                                            |
|           | `fontWeight.medium`| `500`  | Labels, emphasized text                         |
|           | `fontWeight.semibold`| `600` | Headings                                        |
|           | `fontWeight.bold`| `700`  | Strong emphasis                                 |
| Line Height| `lineHeight.normal`| `1.5`  | Standard line height for readability            |
|           | `lineHeight.tight`| `1.25` | Used for headings and compact UI elements       |

### 3. Spacing

A 4px-based scale is used to ensure consistent rhythm and visual order. All margin, padding, and gap properties should adhere to this scale.

*   **2 (8px):** Gap between very close elements, such as an icon and its text.
*   **3 (12px):** Internal padding for small components (badges, tags).
*   **4 (16px):** Default internal padding for components (buttons, inputs). The default gap in layouts.
*   **6 (24px):** Gap between logically distinct UI groups.
*   **8 (32px):** Padding between content and the border within a card. Separation between sections.
*   **12 (48px):** Wide margins that separate major layout regions (e.g., sidebar and content).
*   **16 (64px):** Page-level vertical margins to provide ample breathing room.

### 4. Borders, Radius & Shadows

These are used to create a refined and structured feel. Shadows are used sparingly to express depth and visually communicate an element's hierarchy.

| Property  | Token           | Value      | Usage Guide                                            |
| :-------- | :-------------- | :--------- | :----------------------------------------------------- |
| Radius    | `borderRadius.sm`| `4px`      | Small elements like tags and badges.                   |
|           | `borderRadius.base`| `8px`    | Default. For most UI elements like buttons, inputs, and cards. |
|           | `borderRadius.lg`| `12px`     | Larger containers like modals and popovers.            |
|           | `borderRadius.full`| `9999px` | Avatars and circular profile images.                   |
| Shadow    | `shadows.base`  | `0 1px 3px...`| Default shadow. For elements that float slightly above the page, like dropdowns and tooltips. |
|           | `shadows.lg`    | `0 10px 15px...`| For elements that require user focus, like modals and command palettes. |
|           | `shadows.xl`    | `0 20px 25px...`| Used for critical system notifications or dialogs.     |

### 5. Core Design Principles

These principles are guidelines for applying the design system's tokens to actual UI, ensuring consistency.

*   **Clear Information Hierarchy**
    *   Express the importance of information by combining `fontWeight` and `colors.text` levels (primary, secondary) rather than relying solely on size or color.
    *   Example: Page Title (`fontSize.2xl`, `fontWeight.semibold`), Body (`fontSize.base`, `fontWeight.normal`), Helper Text (`fontSize.sm`, `colors.text.secondary`).

*   **Function-focused Minimalism**
    *   Every design element must have a clear purpose. Avoid unnecessary decorations, excessive color, and complex shadows.
    *   Prioritize using spacing or subtle background colors (`background.secondary`) for separation over strong lines (`border`).

*   **Consistent Interaction Feedback**
    *   All interactive elements must have clear hover, focus, active, and disabled states.
    *   **Hover:** Provide visual feedback using `colors.primary.blueHover` or `background.tertiary`.
    *   **Focus:** A highly visible focus ring (using `outline` or `box-shadow` with `colors.primary.blue`) must always be displayed for keyboard users.
    *   **Animation:** Use `animation.transition.base` (`0.2s ease`) to ensure all state changes feel immediate and smooth.

*   **Accessibility First**
    *   All text and background combinations must meet at least WCAG AA contrast ratios (4.5:1). Pay special attention when using `colors.text.secondary`.
    *   All functionality must be accessible and operable via keyboard only.
    *   Ensure small interactive elements like icon buttons have a sufficient touch area (minimum 44px x 44px).
```