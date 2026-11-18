# Eneba design reference

Measured on 18 November 2026 from the live site. This is a reference for the frontend, not an implementation.

## How this was gathered

**Measured**

- Dembrandt 0.39.2, desktop 1920×1080, `prefers-color-scheme: light`, on `https://www.eneba.com/` and `https://www.eneba.com/store/all`.
- The same pages, plus `https://www.eneba.com/checkout` with one item in the cart, inspected in the browser. Computed styles were read from the page.
- A 390×844 phone viewport, device scale 2, on the homepage and the store.
- The CSS chunks the pages actually loaded (`main`, the store chunks, and the checkout chunk) and the `@font-face` rules in them.

**Not measured**

- Dembrandt was not pointed at `/checkout`. `robots.txt` disallows that path. Checkout numbers below come from the browser session only.
- The Dembrandt `mobile` flag did not change its viewport. It stayed at 1920×1080. Phone numbers below come from the browser emulation, not from that job.
- Signed-in screens (account, order history, the payment step after "Proceed to checkout") were not opened. Those will be filled in from screenshots later.
- No CSS custom properties exist. A search of `:root`, `html`, and computed styles returned an empty variable map.

**Inferred** values are marked in the sections below and in `design-tokens.json`. Everything else in the tables was read from the page or the stylesheet.

## Look of the site

Eneba is a purple marketplace with almost square corners. The page background is `#4618ac`. Content sits on darker purple panels, `#351183` and `#1f0a4d`. Text is white. The one strong action color is yellow, `#fad318`, with black text. Mint `#63e3c2` outlines product cards. Teal `#23c299` marks regions, the active checkout step, and cashback. Lime `#84e916` is the discount color.

Type is Metropolis, self-hosted. The root font size is `62.5%` (10px when the browser default is 16px), so a 16px body is `1.6rem`. Loaded weights are 400, 600, and 800. Headings are set to 700 even though no 700 file exists.

The desktop content column is 1240px max, with 20px of side padding, so the inner measure is 1200px. Checkout is narrower: a 1040px form.

## Color

| Token | Value | Where it was seen |
|---|---|---|
| Page | `#4618ac` | `body` background. Mobile header. |
| Surface | `#351183` | Checkout header bar and the cart, delivery, and summary panels. |
| Raised surface | `#1f0a4d` | Product cards, checkout recommendation cards, trust band. |
| Filter | `#5825cc` | Store filter group headers. |
| Mobile filter | `#2c0e6c` | "Sort and filter" on a 390px store. |
| CTA | `#fad318` | Proceed, subscribe-style, and other primary buttons. Text `#000000`. |
| Text | `#ffffff` | Body, headings, icons. |
| Nav text | `#dcd8e6` | Category links. |
| Muted text | `#b3aac9` | "From" on cards, input text. |
| Faint text | `rgba(255, 255, 255, 0.4)` | Inactive checkout steps. |
| Card border | `#63e3c2` | 1px solid on product cards. |
| Teal | `#23c299` | Region line, active step label. |
| Discount | `#84e916` | Percent and "Cashback" on a card. |
| Footer | `rgba(0, 0, 0, 0.7)` | Homepage footer. |
| Input fill | `rgba(0, 0, 0, 0.2)` | Checkout email field, with `inset 0 1px 3px #1f0a4d`. |

Also measured, component not isolated (treat as palette, not as a named role yet):

- `#150734` and `#0e0523`, deep backgrounds in contrast pairs.
- `#7a4edf`, the most common filled color on the homepage sample.
- `#eb002e`, one fill, likely a sale or alert.
- Logo-only colors inside the wordmark SVG: `#fd5a20`, `#fdbf45`, `#fa9837`, `#a30011`, `#f33d96`, `#e10d66`, `#1f9175`, `#7ef4c3`, `#4cd69e`.

**Inferred.** Dembrandt labeled `#fad318` as primary and `#1f0a4d` as accent. The measurements support yellow as the action color and `#1f0a4d` as a large content surface, so this reference uses those roles instead of Dembrandt's names.

## Typography

Family: `metropolis, Arial, Helvetica, sans-serif`.

Files, all `font-display: swap`:

- 400 `Metropolis-Regular.woff2`
- 600 `Metropolis-Medium.woff2`
- 800 `Metropolis-Bold.woff2`
- Matching `metropolis-monospace` files at the same three weights

Letter-spacing on the sampled UI is `normal`. The stylesheet has a few `1px` and `2px` rules.

| Use | Size / weight / line-height |
|---|---|
| Body | 16px / 400 / 24px (1.5) |
| Desktop section heading and store h1 | 30px / 700 / 37.5px (1.25) |
| Store h1 at 390px | 24px / 700, wraps |
| Homepage h2 at 390px | 20px / 700 / 25px |
| Card price | 22px / 800 / 22px |
| Search input, homepage | 19px / 800 / 19px |
| Checkout "My cart" | 18px / 800 / 22px |
| Filter title | 16px / 800 / 22.4px |
| Primary button | 15px / 800 / 15px |
| Header "Log in" / "Register", sort control | 14px / 600 |
| Card title | 12px / 800 / 18px |
| Card meta, badge, region | 12px / 800 / 12px, region is uppercase |
| Platform line | 10px / 800 / 10px |
| Checkout steps | 12px / 600 / 18px |
| Checkout summary rows | 12px / 400 / 18px |

## Spacing and layout

Common spacing values, in px: 1, 2, 3, 4, 5, 7, 8, 10, 15, 20, 25, 30, 40, 50. This is a custom set. 7px and 10px are more common than a strict 8px grid would predict. Do not invent an 8px system on top of it.

| Measurement | Value |
|---|---|
| Content max width | 1240px |
| Content padding | 0 20px |
| Inner column | 1200px |
| Desktop header | 147px tall, includes the category row |
| Phone header | 56px tall |
| Store columns | 220px sidebar + 20px gap + 960px grid |
| Product grid | 4 columns of 225px, gap 20px |
| Product card | 225×459, image 223×312, border 1px `#63e3c2`, radius 0, fill `#1f0a4d` |
| Section heading | margin-bottom 30px |
| Store block | margin-bottom 40px |
| Checkout form | max-width 1040px, padding 0 5px |
| Checkout panels | cart column about 635px, side column about 355px, panel padding 20px |
| Phone store | one column, card 350×134, grid gap 15px, h1 24px |

## Radius, border, shadow

Most surfaces are square. Radius `0` is the default for buttons, inputs, cards, panels, and the search box.

Measured exceptions: `5px` on the highlighted nav link, `6px` on that link's `::before`, `3px` and `10px` on some store-only elements, `2px` rarely, `50%` on circular spans.

Borders that matter: `1px solid #ffffff` on the search shell and secondary buttons, `1px solid #63e3c2` on product cards. The yellow button has no border.

Shadows: `0 7px 15px rgba(0, 0, 0, 0.2)`, input `inset 0 1px 3px #1f0a4d`, `0 -4px 20px rgba(0, 0, 0, 0.7)`, hard `2px 3px 0 #99001f`, and carousel fades of `#4618ac` on the left and right edges.

Gradient on the highlighted nav pill: `linear-gradient(90deg, #d32252 0%, #3c1395 100%)`.

## Motion and states

The usual transition is `0.15s ease-in-out` on background, border, and color. `0.25s` is the next most common. Header links and icon buttons shift from white to `#fad318` on hover. The stylesheet's most common hover colors are `#fad318`, `#ffffff`, `#351183`, and `#f0a613`.

Focus rules in CSS set `color: #f0a613`, or a background of `#351183`, `#5825cc`, or `rgba(0, 0, 0, 0.3)`. The default outline is `none` at 3px. Disabled controls use `opacity: 0.5`, `cursor: not-allowed`, and `pointer-events: none`. A disabled button's text was measured as `#9385b2` on `#4618ac`.

No named keyframe animations were running on the sampled pages. Keyframe names exist in the CSS bundle, but they were not tied to a visible component.

## Stack

Measured: React, React Router, a small amount of Emotion (`data-emotion` on 10 nodes), and webpack CSS with hashed class names from `static.eneba.games`. Icons are inline SVG. There is no icon font and no SVG sprite. Tailwind and styled-components were not present. The wordmark is `https://static.eneba.games/branding/v2/logoFull.svg`, drawn at 155×48.

## Files

- `design-tokens.json` — the values, with a provenance field on each group.
- `components.md` — header, search, buttons, cards, store controls, checkout.
- `responsive-guidelines.md` — breakpoints and what changes at 390px.
