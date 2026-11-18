# Eneba responsive guidelines

Desktop measurements are from a 1920×1080 extraction and from a browser window about 1318px wide. Phone measurements are from a forced 390×844 viewport with device scale 2. The Dembrandt mobile job did not actually resize, so it is not used here.

## Breakpoints in the CSS

The loaded stylesheets do not use one clean set such as 768 / 1024 / 1280. They use many overlapping `max-width` and `min-width` queries. These are the ones that show up as real thresholds, measured from the CSS:

| Threshold | How it appears |
|---|---|
| 360px, 370px, 400px | Small-phone tweaks, often nested under 600px. |
| 600px / 601px | The main phone boundary. Hover styles are also gated with `min-width: 601px`. |
| 768px | Present, less common than 600 and 800. |
| 800px / 801px | Tablet band, sometimes paired with 1000px or 1024px. |
| 930px / 931px | A layout change of its own, sometimes combined with hover. |
| 1000px / 1001px | Paired with 1200px. |
| 1024px / 1025px | Paired with 800px. |
| 1200px / 1201px | The content column is 1240px, so this is the point where the page stops being a padded column and starts centering it. |
| 1921px | A large-desktop query. What it changes was not isolated. |

Hover is also a breakpoint. Rules use `@media (hover: hover)` and `@media (hover: none)`, including combinations with 601px and 930px. On a touch viewport, hover-only controls (the card's Add to cart) cannot be the only way to act.

**Inferred.** 600px is the phone layout, 601–1200px is a compressed desktop, and 1201px and up is the full 1240px column. The CSS supports that reading, but not every query was mapped to a component.

## What was measured at 390px

### Header

| | Desktop | 390px |
|---|---|---|
| Header height | 147px, transparent, includes the category row | 56px, background `#4618ac` |
| Leading control | Logo | Menu button, 55×55, padding `20px 15px 19px 20px` |
| Search | Text field, about 530–550px wide, 55–57px tall, white 1px border | Icon button |
| Account | "Log in \| Register" text, 14px / 600 | Icon button. Register is not in the bar. |
| Category links | Visible, 16px / 600, `#dcd8e6` | Removed from layout (0×0). An icon scroller sits under the hero instead. |

### Type

| | Desktop | 390px |
|---|---|---|
| Store h1 | 30px / 700 / 37.5px | 24px / 700, wraps to 60px in a 350px column |
| Homepage section h2 | 30px / 700 / 37.5px | 20px / 700 / 25px |
| Body | 16px / 400 / 24px | unchanged on the sampled elements |

"Popular gift cards" is `display: none` on desktop and visible on the phone. That is a content swap, not only a size change.

### Store

| | Desktop | 390px |
|---|---|---|
| Page columns | `220px 960px`, gap 20px, inside 1200px | One block, the sidebar is not a column |
| Filters | Four 220×47 accordion headers, `#5825cc`, 16px / 800 | One "Sort and filter" button, 167×38, `#2c0e6c`, 14px / 600, padding `5px 15px`, gap 5px |
| Product grid | 4 × 225px, gap 20px | 1 × 350px, gap 15px |
| Card | 225×459, portrait, mint border | 350×134, horizontal |
| Content padding | 20px, column max 1240px | Same 20px padding. 390 − 40 = 350, which matches the card and the h1. |

### Checkout

Checkout was not remeasured at 390px. On desktop the form is `max-width: 1040px` and the two columns are about 635px and 355px. **Inferred:** those columns stack under 1040px, and the 355px summary becomes full width. Confirm this when the phone checkout is screenshotted.

## Layout constants to keep at every width

- Page background `#4618ac`.
- Content max-width 1240px, side padding 20px. Below 1240px the column is the viewport minus 40px.
- Checkout form max-width 1040px, side padding 5px.
- Radius stays 0 on buttons, fields, cards, and panels.
- Primary button stays 15px / 800, height 35px, `#fad318` with black text.
- Do not show hover-only actions as the only control under `@media (hover: none)` or under 600px.

## Reduced motion

The extraction ran with `prefers-reduced-motion: no-preference`. No reduced-motion stylesheet was identified. The motion system is short (mostly 150ms and 250ms, ease-in-out) and changes color and background rather than large movement.
