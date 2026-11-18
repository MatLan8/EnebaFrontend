# Eneba components

Values are computed styles unless a line says they came from a stylesheet. Phone notes are from a 390×844 viewport. Signed-in components are not in this file.

## Header

Desktop, measured at about 1318px wide:

- The header element is 1240px max, 147px tall, padding `0 20px`, background transparent so the page purple shows through.
- Logo link: 155×48, margin-right 20px, `z-index: 2`. Hover transition: `opacity 0.15s ease-in-out`. Asset: `https://static.eneba.games/branding/v2/logoFull.svg`.
- Search sits beside the logo. On the homepage the input is 528×55. On the store the bordered shell is 550×57.
- To the right: language/currency ("English EU | EUR"), wishlist, cart, then "Log in | Register".
- Those account links are 14px / 600, white, transparent, about 57px tall. Hover color, measured by interaction: `#fad318`.

Phone:

- Header is 390×56, `display: flex`, background `#4618ac`.
- A "Menu" button is 55×55, padding `20px 15px 19px 20px`, same purple as the header.
- Search collapses to an icon. Wishlist, cart (with a count badge), and an account icon stay in the bar. "Register" is not in the bar.
- The category text row is removed from layout (`Categories` measured at 0×0). A horizontal icon scroller (Games, Gaming eCards, eGift Cards) replaces it under the hero.

## Category navigation

Desktop row under the header, inside the 147px header:

- Link: 16px / 600, color `#dcd8e6`, line-height 16px, padding 10px, height 50px.
- Transition: `color 0.15s ease-in-out, background 0.15s ease-in-out`.
- The list itself is padded `0 10px`.

Highlighted item ("GTA 6"), measured on the element:

- 16px / 800, color `#dcd8e6`, padding `5px 15px`, height 34px, width 78px, `border-radius: 5px`.
- Fill is not `background-color`. It is `background-image: linear-gradient(90deg, rgb(211, 34, 82) 0%, rgb(60, 19, 149) 100%)`.
- Its `::before` is 36×80 with `border-radius: 6px` and a transparent background.

## Search

Homepage input:

- 19px / 800, line-height 19px, color white, background transparent, border 0.
- Padding `0 0 0 40px` (room for the magnifying glass).
- Placeholder: "Search for games, top-ups and more".

Store shell around that input:

- `display: flex`, gap 10px, padding `0 10px`, height 57px, width 550px.
- `border: 1px solid #ffffff`, `border-radius: 0`.

**Not measured.** The focus ring on the search input. Dembrandt returned `focus: null`. CSS elsewhere uses `#f0a613` and dark purple fills for focus, but those rules were not tied to this input.

## Buttons

Primary, class pattern seen on "Proceed to checkout":

- Background `#fad318`, color `#000000`, border 0, radius 0.
- 15px / 800, line-height 15px, padding `0 10px`, height 35px.
- Checkout CTA width 295px, full width of the summary column's inner area.
- Transition: `background-color 0.15s ease-in-out, border-color 0.15s ease-in-out`.

Secondary, "Subscribe" and the cookie "Customize" button:

- Transparent background, `1px solid #ffffff`, white text, same 15px / 800 and `0 10px` padding, height 35px, radius 0.

Header text buttons ("Log in", "Register"):

- Not the yellow button. 14px / 600, white, no border, padding 10px.
- "Register" also exists as a yellow 15px / 800 button in a collapsed (0×0) duplicate, which is the mobile-menu version of the same control.

Quantity, checkout:

- "-" and "+" are 25×25, 20px / 600, white, padding `2px 0 1px`, border `1px solid transparent`.

Icon buttons (wishlist, remove) on a cart row:

- About 16px, color `rgba(255, 255, 255, 0.7)`, no fill.

Hover, from the stylesheet and from Dembrandt's interaction pass:

- Header links and icon buttons: color `#ffffff` to `#fad318`.
- Other hover fills declared in CSS, not all tied to one component: `#ffffff`, `#351183`, `#f0a613`, `rgba(0, 0, 0, 0.3)`.

Disabled, from CSS and one rendered button:

- `opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none`.
- One disabled button's text computed to `#9385b2` on `#4618ac`.
- "Get your product" in the checkout stepper is disabled until payment and uses the inactive step color `rgba(255, 255, 255, 0.4)`.

## Product card

Desktop store grid: `grid-template-columns: 225px 225px 225px 225px`, gap 20px, inside a 960px column.

Card:

- Outer box 225×459 (223px content plus the border), `display: grid`, one column.
- Background `#1f0a4d`.
- Border `1px solid #63e3c2`.
- Radius 0. Shadow none in the resting state.
- Cover image 223×312. The image frame uses padding-top `312.188px` and margin-bottom `-60px`, so the artwork overlaps the text block.

Text inside, top to bottom:

| Line | Style |
|---|---|
| "CASHBACK" | 12px / 800, uppercase, color `#1f0a4d`. The span itself is transparent, so the badge fill is a parent that was not isolated. |
| Platform ("Roblox") | 10px / 800 / 10px, color `rgba(255, 255, 255, 0.85)` |
| Title | 12px / 800 / 18px, white, about 193px wide, two lines on the sample |
| Regions | 12px / 800 / 12px, uppercase, `#23c299` |
| "From" | 12px / 800 / 12px, `#b3aac9` |
| Price | 22px / 800 / 22px, white |
| Discount | 12px / 800, `#84e916` ("6%" and "Cashback") |

"Add to cart" and "View offers" are 15px / 800. On the store grid they are hidden until hover (`display` was `none` on the homepage sample and the hit target was 0×0 until interaction). The label color for "Add to cart" computed as black, which means it sits on a yellow control. **Inferred:** that control uses the primary button style. The resting card does not show it.

Phone, 390px:

- The grid becomes one column of 350px, gap 15px.
- The card is 350×134. It is a horizontal row, not the tall desktop card.
- Image and type scale inside that row were not measured separately.

## Store chrome

Desktop:

- Page h1: 30px / 700 / 37.5px, white, margin `10px 0 30px`.
- Layout: `grid-template-columns: 220px 960px`, gap 20px, width 1200px, margin-bottom 40px.
- Filter group ("Price range", "Platforms", "Genres", "Regions"): button 220×47, background `#5825cc`, white, 16px / 800, line-height 22.4px, padding `15px 20px 10px`, radius 0. Inner grid `157px 23px`. Transition: `padding-bottom 0.15s ease-in-out`.
- Sort: "Popularity: Most popular", 14px / 600, padding 10px, height 40px, transparent, white.

Phone:

- The 220px sidebar is gone. Layout is a single block.
- "Sort and filter (1)": `display: flex`, 167×38, background `#2c0e6c`, 14px / 600, padding `5px 15px`, gap 5px, white.
- h1 is 24px / 700 and wraps to 60px tall in a 350px column.
- Sort options in the dialog include Price low/high and Date newest/oldest, 14px / 400 when closed on desktop.

## Checkout

Logged-out cart at `/checkout` after adding one offer. The page title is "Your cart".

Header strip: background `#351183`, padding `23px 20px`, full viewport width, height about 94px. It holds the logo, the step row, and the language control. The category nav is absent.

Steps:

- "Cart" is active: 12px / 600, color `#23c299`.
- "Payment" and "Get your product" are 12px / 600, color `rgba(255, 255, 255, 0.4)`. "Get your product" is a disabled button.
- The step number "1" is 16px / 600, white. The green disc around it is visible, but the span and its parents computed to a transparent background, so the disc is drawn by an SVG or a background image. **Inferred:** the disc uses the same `#23c299` as the active label. That color was not read off the disc itself.

Form: max-width 1040px, padding `0 5px`, `display: flex`.

Panels, all `#351183`, radius 0:

- "My cart" column about 635px, padding 20px. Heading 18px / 800 / 22px, white.
- Cart row: background `rgba(0, 0, 0, 0.12)`, padding `10px 20px 5px 0`. Thumbnail link about 90×127. Title 14px / 800. Seller name 12px / 800.
- "Where to deliver the order?" about 355px, padding 20px.
- "Summary" about 355px. Primary button as specified above.
- Summary lines: 12px / 400 / 18px ("1 product", "Service fee", total).
- Trust band under the form: `#1f0a4d`, padding `35px 20px 40px`. Heading 16px / 700 / 24px: "Shopping on Eneba is risk-free & easy!"

Email field shell:

- 315×40, background `rgba(0, 0, 0, 0.2)`, color `#b3aac9`, 12px / 600 / 18px, padding `0 10px`, radius 0.
- Shadow: `inset 0 1px 3px #1f0a4d`.
- Border 0.

Recommendation cards under the summary ("Inspired by your picks") reuse `#1f0a4d` at about 182×335.

## Homepage blocks

Measured as structure, not as a second visual system. The blocks use the same type and color:

- Hero carousel of campaign banners, with yellow "See the deals" / "BUY" buttons and a countdown.
- Edge fades: `linear-gradient(90deg, #4618ac 50%, transparent)` and the mirrored gradient, plus `#4618ac` side shadows.
- Sections titled at h2, 30px / 700, margin-bottom 30px: Recommended for you, Top games, Best selling eGift Cards, Best selling gift cards, Upcoming games, Categories.
- At 390px the first visible h2 ("Popular gift cards") is 20px / 700. A "Popular gift cards" h2 is `display: none` on desktop and shown on the phone.
- Footer: `rgba(0, 0, 0, 0.7)`, full width. Newsletter email input is 35px tall, 14px / 800, padding-left 15px, `1px solid #ffffff`.

## Links

- Default in the chrome: white, `text-decoration: none`.
- Nav: `#dcd8e6`. One measured nav state used underline.
- Muted inline links: `#b3aac9`, underline `rgba(255, 255, 255, 0.4)`, weight 600.
- Yellow text links: `#fad318`, no underline, weight 400.
- A browser-default blue link (`#0000ee`, hover `#991b1b`) was detected once. **Inferred:** that is an unstyled fallback, not a brand link. Do not copy it.
