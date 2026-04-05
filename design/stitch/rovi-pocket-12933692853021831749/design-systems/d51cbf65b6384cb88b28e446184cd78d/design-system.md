# Design System Document: The Executive Tactician

## 1. Overview & Creative North Star
**Creative North Star: The Digital Concierge**
This design system is engineered to transform a complex real estate CRM into a streamlined, high-performance instrument. We are moving away from the "cluttered dashboard" trope and toward a "Tactical Editorial" aesthetic. It feels like a high-end Swiss watch or a premium vehicle’s heads-up display—authoritative, silent, and incredibly fast.

To break the "template" look, we utilize **Intentional Asymmetry** and **Tonal Depth**. We avoid traditional grid-block layouts in favor of a "Stream" of information where the hierarchy is dictated by typography scale and surface elevation rather than boxes and lines.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Deep Space" philosophy, using high-contrast accents to guide the eye toward critical brokerage actions.

### The Palette
- **Primary (The Pulse):** `#3fff8b` (Electric Emerald). Use this for high-impact actions and "Success" states.
- **Secondary (The Logic):** `#929bfa` (Soft Cobalt). Use this for informational cues and technical data.
- **Neutral Core:** Base on `surface` (`#0c0e11`) with varying levels of `surface-container` for depth.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. 
Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a Lead Card (`surface-container-high`) sits directly on the page background (`surface-dim`) without a stroke. The contrast creates the edge.

### The "Glass & Gradient" Rule
To elevate the CRM from "SaaS" to "Premium," use Glassmorphism for floating UI (like the FAB or Bottom Nav).
- **Surface:** `surface-container-low` at 80% opacity + 20px Backdrop Blur.
- **Signature Texture:** Primary CTAs should not be flat. Apply a subtle linear gradient from `primary` (`#3fff8b`) to `primary-container` (`#13ea79`) at a 135° angle to provide a "machined" metallic sheen.

---

## 3. Typography: Editorial Authority
We use a dual-font system to balance character with readability.

*   **Display & Headline (Manrope):** Bold, wide, and modern. Used for high-level data points (e.g., Property Price, Lead Name).
*   **Body & Label (Inter):** Tight, legible, and functional. Used for CRM notes, timestamps, and metadata.

**Hierarchy Strategy:**
- **The "Lead" Header:** Use `headline-sm` for property titles, but pair it immediately with a `label-sm` in `on-surface-variant` for the location. The contrast in font-weight and color does the work that a divider line usually does.
- **Asymmetric Weighting:** Don't center-align. Flush-left everything to create a "spine" that the eye can follow quickly while scanning on the go.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "web 2.0." We use **Tonal Layering** to create a physical sense of "stacking."

*   **The Layering Principle:** 
    1.  **Level 0 (Base):** `surface` (`#0c0e11`)
    2.  **Level 1 (Sections):** `surface-container-low`
    3.  **Level 2 (Interactive Cards):** `surface-container-high`
*   **Ambient Shadows:** If a card must "float" (e.g., a high-priority Lead alert), use a shadow color tinted with `#3fff8b` at 5% opacity, with a 32px blur. This mimics the glow of a screen rather than a heavy physical shadow.
*   **The "Ghost Border" Fallback:** If a UI element lacks contrast against a background, use `outline-variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Pocket Kit

### The Central FAB (Action Hub)
The center of the bottom bar is the "Global Action." 
- **Style:** Circular, `primary` background.
- **Elevation:** Use the "Signature Texture" gradient. 
- **Interaction:** On tap, it doesn't just open a menu; it blurs the background (`surface-dim` at 60%) to focus the user entirely on the "New Lead" or "Quick Note" options.

### Compact Lead Cards
- **Structure:** No borders. `surface-container-high` background.
- **Corner Radius:** `xl` (0.75rem) for the outer container, `md` (0.375rem) for inner status chips.
- **Spacing:** Use 16px internal padding. Separate the "Lead Name" from "Property Info" using 4px of vertical space—no dividers.

### State Chips (The Status Indicators)
- **Active:** `secondary-container` background with `on-secondary-container` text.
- **Urgent:** `error_container` background with `on-error_container` text.
- **Shape:** Full pill (`full` / 9999px).

### Quick Actions & Timeline
- **Timeline:** Use a 2px vertical track using `surface-container-highest`. Do not use a high-contrast line.
- **Interaction:** All touch targets must be a minimum of 44x44pt, following the "One-hand friendly" rule, with primary actions located in the "Natural Thumb Zone" (bottom 1/3 of the screen).

---

## 6. Do’s and Don’ts

### Do
- **Do use "Surface-Tint":** Use the `surface_tint` token to give dark surfaces a very slight emerald hue, making the dark mode feel "branded" rather than just "black."
- **Do embrace negative space:** If a screen feels crowded, remove a background container before you try to shrink the text.
- **Do use Loading Skeletons:** Use `surface-container-highest` for skeleton pulses to maintain the "Fast" brand promise even during data fetches.

### Don't
- **Don't use 100% White:** Never use `#ffffff` for text. Use `on_surface` (`#f9f9fd`) to prevent "eye bleed" on high-contrast OLED mobile screens.
- **Don't use standard dividers:** If you feel the urge to add a `<hr>` line, try adding 8px of extra whitespace or shifting the background color by one "surface-container" tier instead.
- **Don't center-align buttons:** Keep primary actions right-aligned or full-width to accommodate one-handed thumb reach.
