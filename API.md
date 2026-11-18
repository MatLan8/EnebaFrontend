# Eneba Backend: HTTP API Reference

This is for the frontend (React + TS). It was written from the backend source: `internal/server/router.go`, `internal/handlers`, `internal/requests`, `internal/responses`, `internal/httpx`, `internal/middleware`, `internal/config` and `http/*.http`. When this file and the code disagree, the code is right.

---

## 1. Overview

| Item | Value |
|---|---|
| Local base URL | `http://localhost:8080` (`PORT` env, default `8080`) |
| API prefix | `/api/v1` (every route except `GET /health`) |
| Health check | `GET /health` (no prefix) |
| Content type | Requests with a body: `Content-Type: application/json`. Every JSON response has `Content-Type: application/json` |
| Request body limit | 1 MB. Unknown JSON fields are **rejected** (400 `bad_request`), and so is a body with more than one JSON value |

### JSON conventions
- **Field names are camelCase**, e.g. `basePriceCents`, `imageUrl`, `checkoutUrl`.
- **Money is always integer cents** (`int`) plus a `currency` string. Every offer is in `"EUR"` today. Format it on the client, e.g. `(cents / 100).toLocaleString(..., { style: 'currency', currency })`. Every object that has a cents field also has a `currency` field (for products, the top-level `currency` is the currency of `basePriceCents`, and `price.currency` is the currency of the offer price).
- **Timestamps** (`createdAt`, `paidAt`, `purchasedAt`, `expiresAt`) are Go `time.Time` values serialized as **RFC 3339 strings, possibly with fractional seconds and a zone offset**, e.g. `"2026-11-18T19:49:03.123456Z"` or `"...+02:00"`. Parse them with `new Date(value)`.
- **Dates**: `releaseDate` is a plain `"YYYY-MM-DD"` string.
- **IDs**: database IDs are **UUID strings** (`id`, `offerId`, `orderId`, …). Orders also have a human-readable **`publicId`** like `"o-k3x9q2a"` (`o-` followed by 7 characters from `[a-z0-9]`). This is the "order number" shown to the buyer. **Routes always take the UUID `id`, never the `publicId`.**
- **Nullability**: Go pointer fields are always present in the JSON and can be `null`. The only `omitempty` field in the API is `error.details` (see §3). Empty lists are `[]`, never `null`.
- **Product `slug`** is the product page key (`/api/v1/products/{slug}`), e.g. `elden-ring-pc-steam-key-global`.

### Shared enums (TypeScript)
```ts
type ProductType = 'game' | 'dlc' | 'gift_card' | 'subscription' | 'software' | 'top_up';
type Platform = 'steam' | 'xbox_live' | 'psn' | 'nintendo_eshop' | 'ea_app' | 'ubisoft'
              | 'epic_games' | 'battlenet' | 'official_website';
type Region = 'global' | 'europe' | 'north_america' | 'uk' | 'latam' | 'asia';
type OrderStatus = 'pending' | 'paid' | 'cancelled';
// pending   = created at checkout, waiting for payment (keys are reserved)
// paid      = Stripe confirmed payment (via webhook), keys are sold to the buyer
// cancelled = the Stripe session expired or failed, keys were released, the order has no items
```
The backend does not provide display labels for these values (except genres); map them to labels on the frontend.

### Shared price object
```ts
interface Price {
  cents: number;                  // price of the (cheapest buyable / this) offer
  discountPercent: number | null; // vs. basePriceCents, rounded to the nearest whole percent.
                                  // null when the offer is NOT cheaper than the base price.
                                  // It can be 0 (a tiny discount below 0.5%).
  currency: string;               // "EUR"
}
```
`basePriceCents` (the official price, shown crossed out) sits next to `price` on the product objects. Only show the crossed-out base price when `discountPercent !== null`.

### CORS and cookies (important)
- CORS allows only the origins in `CORS_ORIGINS` (comma-separated, default `http://localhost:5173`) **with credentials**.
  - Allowed methods: GET, POST, PATCH, DELETE, OPTIONS.
  - Allowed request headers: `Authorization` and `Content-Type`.
  - Exposed response header: `X-Request-Id`. Every response carries it.
  - Preflight responses are cached for 300 s.
- The backend uses two **HttpOnly** cookies, which JavaScript can't read:

| Cookie | Path | Lifetime | Purpose |
|---|---|---|---|
| `refresh_token` | `/api/v1/auth` | refresh TTL (default 7 days) | Rotating refresh token |
| `cart_token` | `/` | 180 days, renewed on every cart change | The anonymous cart's ID |

  - Locally both cookies are `SameSite=Lax` and not `Secure`.
  - In production (`APP_ENV=production`) both are `SameSite=None; Secure`, because the frontend and API are on different domains.
- **Every request must use `credentials: 'include'`** (or axios `withCredentials: true`), at least on:
  - all `/api/v1/auth/*` calls,
  - all `/api/v1/cart*` calls,
  - `POST /api/v1/checkout`, which reads `cart_token`.

  The simplest rule is to use it on every API call.
- The cart belongs to the **browser** (the cookie), not to the user. It works before login, and logging in or out doesn't change it.

### Frontend URL and Stripe redirects
`FRONTEND_URL` (env, default `http://localhost:5173`, trailing slash removed) is used only to build the Stripe redirect URLs in `POST /api/v1/checkout`:

| Redirect | URL | Frontend page must handle |
|---|---|---|
| Success | `${FRONTEND_URL}/orders/${orderId}?paid=1` | Order detail page for order **UUID** `orderId`, with query `paid=1` |
| Cancel | `${FRONTEND_URL}/cart` | Cart page, with no query parameters |

**The success redirect does NOT mean the order is paid.** Payment is confirmed only by the Stripe webhook, which can arrive slightly after the redirect. On `/orders/:id?paid=1`, the order may still be `pending` for a moment. The frontend should show a "confirming payment…" state and re-fetch `GET /api/v1/orders/{id}` (e.g. poll every 1–2 s for a short time) until `status === 'paid'`. The backend has no push or long-poll endpoint. The `paid=1` flag is never read by the backend.

---

## 2. Authentication

- **Access token**:
  - It's a JWT (HS256), returned in the JSON body as `accessToken`.
  - Send it as the header **`Authorization: Bearer <accessToken>`**. The scheme name is case-insensitive.
  - It is **not** a cookie. Keep it in memory (or in your auth store).
  - Lifetime is `JWT_ACCESS_TTL`, default **15 minutes**. The exact expiry is returned as `expiresAt`.
- **Refresh token**:
  - It's an opaque random string, only ever in the HttpOnly `refresh_token` cookie (path `/api/v1/auth`). It is never in a JSON body.
  - Lifetime is `JWT_REFRESH_TTL`, default **7 days**.
  - **Every successful refresh rotates it**: the old token is revoked and a new cookie is set.
- **Parallel refreshes (grace window)**: a refresh that arrives with a token rotated **less than 30 seconds ago** (e.g. two tabs refreshing at once) is treated as a parallel request, not theft.
  - It gets `200` with a new `AuthResponse` (a new access token) but **no `Set-Cookie`**. The browser keeps the successor cookie from the first refresh.
  - If that successor has already been revoked (logout) or rotated again, it gets `401 invalid_token`. The cookie is not cleared and no sessions are revoked.
- **Refresh-token reuse detection**: if a rotated token is presented **30 seconds or more** after its rotation, the backend treats it as theft. It **revokes every session of that user**, clears the cookie and answers `401 invalid_token`. The user must log in again.
  - Recommendation: still share a single in-flight refresh promise inside one tab. The grace window is there to cover several tabs.
- **Suggested client flow**:
  1. On app start, call `POST /auth/refresh` (with credentials). 200 means logged in, and you get a token and user. 401 means logged out.
  2. Attach the bearer token to protected calls.
  3. On a `401` from a protected call (`invalid_token`, i.e. expired), call refresh once, then retry the request. If the refresh also fails, treat the user as logged out.
  4. You can also refresh shortly before `expiresAt`.
- **Protected endpoints**, which need a bearer token:
  - `GET /api/v1/users/me`
  - `POST /api/v1/checkout`
  - `GET /api/v1/orders`
  - `GET /api/v1/orders/{id}`
  - `GET /api/v1/orders/{id}/keys`
  - `GET /api/v1/keys`

  Everything else is public.
- **401 shapes from protected endpoints**:
  - No `Authorization` header, or one that isn't `Bearer <token>`: `401 {"error":{"code":"unauthorized","message":"authentication required"}}`
  - Expired, malformed or wrongly signed token: `401 {"error":{"code":"invalid_token","message":"invalid or expired token"}}`
  - A valid token whose user was deleted (`/users/me`, `/checkout`) also gives `401 invalid_token`.

---

## 3. Errors

Every error (except `/health`'s 503, see §5.1) uses this envelope:
```ts
interface ApiErrorBody {
  error: {
    code: string;                       // stable machine code, switch on this
    message: string;                    // English, safe to show, but prefer your own copy
    details?: Record<string, string | number>; // OMITTED when there are no details. Values keep their JSON type.
  };
}
```
For `validation_failed`, `details` maps **field or query-parameter name → problem message**, and all problems are reported at once. Example: `{"page":"must be a whole number, 1 or more","limit":"must be a whole number from 1 to 60"}`.

Numeric details are JSON numbers, e.g. `{"availableQuantity": 3, "offerId": "…"}`. Ids and statuses are strings.

| HTTP | `code` | Meaning | `details` |
|---|---|---|---|
| 400 | `bad_request` | Body is not valid JSON, is empty, has an unknown field or a field of the wrong type, holds more than one JSON value, or is over 1 MB. Also a webhook body that is too large or unreadable | none |
| 400 | `validation_failed` | Field or query values are invalid | `{ [field]: message }` |
| 400 | `cart_empty` | Checkout with no `cart_token` cookie, an unknown cart, or a cart with no items | none |
| 400 | `invalid_signature` | (webhook only) Bad or missing `Stripe-Signature`, or no webhook secret configured | none |
| 401 | `unauthorized` | Missing or malformed `Authorization` header | none |
| 401 | `invalid_token` | Expired or invalid access token; missing, expired, revoked or reused refresh token; the user no longer exists | none |
| 401 | `invalid_credentials` | Login with an unknown email or a wrong password (same answer for both) | none |
| 404 | `not_found` | Unknown route, unknown product slug, unknown or inactive offer, offer not in the cart, missing cart (on PATCH or DELETE item), unknown order or **another user's order** | none |
| 405 | `method_not_allowed` | The route exists but not for this HTTP method | none |
| 409 | `email_taken` | Register with an already registered email | none |
| 409 | `insufficient_stock` | Not enough available keys. From the cart: `availableQuantity`. From checkout: `availableQuantity` and `offerId` | `{ availableQuantity: number, offerId?: "<uuid>" }` |
| 409 | `offer_unavailable` | Checkout: an offer in the cart has been deactivated. Remove that item | `{ offerId: "<uuid>" }` |
| 409 | `checkout_already_completed` | Checkout: this cart's previous Stripe session was already paid, and the webhook is confirming (or has confirmed) that order. Don't start a new checkout; go to that order | `{ orderId: "<uuid>" }` |
| 409 | `checkout_superseded` | Checkout: a newer checkout of the same cart (e.g. a double click) replaced this one while it was starting. Use the other request's `checkoutUrl`, or retry | none |
| 409 | `order_not_paid` | Order keys requested for an order that isn't paid | `{ status: "pending" \| "cancelled" }` |
| 500 | `internal_error` | Unexpected server error (details are logged server-side only) | none |
| 502 | `payment_provider_error` | Checkout: a Stripe call failed (creating the new session, or expiring the cart's previous one). Nothing is left reserved for the new attempt; the user can retry | none |

Error messages for the `validation_failed` details used in this API:
- `"is required"`
- `"must be a valid email address"`
- `"must be at least N characters"`
- `"must be at most N characters"`
- `"is invalid"`
- `"must be one of: a, b, c"`
- `"must be a whole number of cents, 0 or more"`
- `"must be greater than or equal to minPrice"`
- `"must be a whole number, 1 or more"`
- `"must be a whole number from 1 to 60"`
- `"must be a valid UUID"`
- `"must not be the nil UUID"`
- `"must be between 1 and 10"`
- `"a cart can hold at most 10 keys of one offer, it already has N"`

Every response has an `X-Request-Id` header (exposed via CORS). Log it with errors, since it matches the server logs.

---

## 4. Pagination

Paginated lists (`/products`, `/orders`, `/keys`) take `page` and `limit` query parameters and return:
```ts
interface Paginated<T> {
  items: T[];          // [] when empty
  page: number;        // echoes the request (default 1)
  limit: number;       // echoes the request (or the default)
  total: number;       // total matching items across all pages
  totalPages: number;  // ceil(total / limit); 0 when total is 0
}
```
A page past the end returns `items: []` with a correct `total` and `totalPages`. It is not an error.

| Endpoint | `page` default | `limit` default | `limit` max | Invalid value |
|---|---|---|---|---|
| `GET /api/v1/products` | 1 | 24 | 60 | 400 `validation_failed` (`page` and/or `limit`) |
| `GET /api/v1/orders` | 1 | 10 | 60 | 400 `validation_failed` |
| `GET /api/v1/keys` | 1 | 10 | 60 | 400 `validation_failed` |

`page` must be an integer ≥ 1. `limit` must be an integer from 1 to 60. Non-numeric values are rejected.

Home blocks (12 products) and suggestions (6 items) have fixed sizes and no pagination.

---

## 5. Endpoints

### 5.1 Health

#### `GET /health`
- Public. No `/api/v1` prefix.
- `200 {"status":"ok","database":"up"}`
- `503 {"status":"degraded","database":"down"}`. Note that this is **not** the error envelope.
```ts
interface HealthResponse { status: 'ok' | 'degraded'; database: 'up' | 'down'; }
```
```bash
curl http://localhost:8080/health
```

---

### 5.2 Auth

```ts
interface User {
  id: string;        // UUID
  name: string;
  email: string;
  createdAt: string; // RFC 3339
}
interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string; // RFC 3339, when accessToken expires
  user: User;
}
```

#### `POST /api/v1/auth/register`
- Public. Body:
```ts
interface RegisterRequest {
  name: string;     // trimmed; required, 2–50 characters
  email: string;    // trimmed; required, valid email, max 254
  password: string; // NOT trimmed; required, 8–72 characters
}
```
- `201` returns `AuthResponse` and sets the `refresh_token` cookie. The user is logged in immediately.
- Errors:
  - `400 bad_request` (malformed body or unknown field)
  - `400 validation_failed` (details keys: `name`, `email`, `password`)
  - `409 email_taken`
```bash
curl -i -c cookies.txt -X POST http://localhost:8080/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane","email":"jane@example.com","password":"supersecret1"}'
```

#### `POST /api/v1/auth/login`
- Public. Body:
```ts
interface LoginRequest {
  email: string;    // trimmed; required, valid email, max 254
  password: string; // required
}
```
- `200` returns `AuthResponse` and sets the `refresh_token` cookie.
- Errors:
  - `400 bad_request`
  - `400 validation_failed` (`email`, `password`)
  - `401 invalid_credentials`, for both an unknown email and a wrong password
- Dev seed data: seeded users share the password `Password123!`, e.g. `emma.johnson@example.com`. This is local seed data only.
```bash
curl -i -c cookies.txt -X POST http://localhost:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"emma.johnson@example.com","password":"Password123!"}'
```

#### `POST /api/v1/auth/refresh`
- Public. **No body.** Reads the `refresh_token` cookie, so it needs `credentials: 'include'`.
- `200` returns `AuthResponse` (new access token) and sets a **new** `refresh_token` cookie (rotation).
- `200` **without `Set-Cookie`**: the token was rotated less than 30 seconds ago by a parallel refresh (grace window, see §2). It returns a fresh access token only.
- Errors: `401 invalid_token`, which also **clears** the cookie, when:
  - the cookie is missing or empty,
  - the token is unknown, expired or revoked (logged out),
  - the user no longer exists,
  - or the token was **reused** 30 seconds or more after its rotation. In that case every session of the user is revoked as well.

  Inside the grace window, a token whose successor is no longer active gets `401 invalid_token` **without** clearing the cookie.
```bash
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:8080/api/v1/auth/refresh
```

#### `POST /api/v1/auth/logout`
- Public. **No body.** Revokes the refresh token in the cookie (if any) and clears the cookie.
- Always `204 No Content`, even without a cookie, so calling it twice is harmless. It can only fail with `500`.
- The access token is **not** invalidated server-side: it stays valid until it expires (at most `JWT_ACCESS_TTL`, 15 minutes by default). This is a deliberate trade-off for stateless JWTs. Drop it from client memory.
```bash
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:8080/api/v1/auth/logout
```

#### `GET /api/v1/users/me`
- **Auth required.**
- `200` returns `User`.
- Errors: `401 unauthorized` / `401 invalid_token` (including when the user was deleted).
```bash
curl http://localhost:8080/api/v1/users/me -H "Authorization: Bearer $TOKEN"
```

---

### 5.3 Home

#### `GET /api/v1/home`
- Public. No parameters.
- `200`:
```ts
interface HomeResponse { blocks: HomeBlock[]; }
interface HomeBlock {
  title: string;               // display title
  productTypes: ProductType[]; // which store filter the block's "Show all" link should open
  products: ProductListItem[]; // up to 12, best sellers first (by sold count, then title)
}
```
- The blocks always come in this order. **A block with no buyable products is omitted entirely**, so `blocks` can have 0–3 entries:

| # | `title` | `productTypes` |
|---|---|---|
| 1 | `"Most popular games"` | `["game"]` |
| 2 | `"Most popular subscriptions"` | `["subscription"]` |
| 3 | `"Most popular add-ons"` | `["gift_card", "top_up"]` |

- "Show all" link idea: `/store?type=gift_card&type=top_up`, which maps to `GET /api/v1/products?type=gift_card&type=top_up`.
- Products and prices work exactly like the store list (see `ProductListItem` below).
```bash
curl http://localhost:8080/api/v1/home
```

---

### 5.4 Products / store

**"Buyable" rule, used everywhere in lists:** a product appears in lists, counts, suggestions, home and filters only if it has at least one **active offer with an available key**. An available key is not sold and not reserved by a checkout in progress. Its listed `price` is the **cheapest buyable offer**, which is the same as the first offer on its product page. Out-of-stock products drop out of all lists, but their product page (`GET /products/{slug}`) still opens, with `offers: []`.

```ts
interface ProductListItem {
  id: string;            // UUID
  slug: string;
  title: string;
  imageUrl: string;
  type: ProductType;
  platform: Platform;
  region: Region;
  basePriceCents: number; // official price (crossed out when discounted)
  currency: string;       // currency of basePriceCents ("EUR")
  price: Price;           // cheapest buyable offer
}
```

#### `GET /api/v1/products`
- Public. All query parameters are optional:

| Param | Type | Repeatable | Notes |
|---|---|---|---|
| `q` | string | no | Trimmed, max 100 characters. Title search: a case-insensitive substring match **or** a fuzzy match (pg_trgm `word_similarity ≥ 0.5`, so it tolerates typos: `eldn ring` finds Elden Ring). Empty means no search |
| `type` | `ProductType` | yes (`?type=game&type=dlc`) | OR within the parameter. Invalid value gives 400 |
| `platform` | `Platform` | yes | OR within. Invalid value gives 400 |
| `region` | `Region` | yes | OR within. Invalid value gives 400 |
| `genre` | genre slug | yes | OR within. Unknown slugs simply match nothing (no error) |
| `minPrice` | int cents ≥ 0 | no | Compared with the cheapest buyable offer price (inclusive) |
| `maxPrice` | int cents ≥ 0 | no | Inclusive. Must be ≥ `minPrice` |
| `sort` | enum | no | `popular` (default; most sold first), `price_asc`, `price_desc`, `newest` (release date desc), `oldest`, `name_asc`, `name_desc`. Ties are broken by title, then id, so pages are stable. **There is no relevance sort**: with `q` the default is still `popular` |
| `page` | int ≥ 1 | no | default 1 |
| `limit` | int 1–60 | no | default 24 |

  Different parameters are combined with AND.
- `200` returns `Paginated<ProductListItem>`.
- Errors: `400 validation_failed`. Details keys: `q` (`"must be at most 100 characters"`), `type`, `platform`, `region`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`. For enums the message lists the allowed values.
```bash
curl 'http://localhost:8080/api/v1/products?platform=steam&type=game&maxPrice=6000&sort=price_asc&page=1&limit=24'
```

#### `GET /api/v1/products/filters`
- Public. No parameters. It provides the store sidebar's filter options with counts of **buyable** products, so the counts add up to the unfiltered store total.
- The counts are global: they **don't** change with the currently applied filters.
- `200`:
```ts
interface ProductFiltersResponse {
  types: FilterOption[];      // value is a ProductType
  platforms: FilterOption[];  // value is a Platform
  regions: FilterOption[];    // value is a Region
  genres: GenreFilterOption[];
}
interface FilterOption { value: string; count: number; }                 // sorted by count desc, then value
interface GenreFilterOption { value: string; label: string; count: number; } // value = slug for ?genre=, label = display name
```
- Only values with at least one buyable product appear. Values with zero products are not listed.
- There is no price range in this response. The store's price filter takes any whole number of cents via `minPrice` / `maxPrice` on `GET /api/v1/products`.
```bash
curl http://localhost:8080/api/v1/products/filters
```

#### `GET /api/v1/products/suggestions`
- Public. This is the search-box dropdown.

| Param | Type | Notes |
|---|---|---|
| `q` | string | **Required (the parameter must be present)**. It's trimmed. **Fewer than 3 characters** (counted as Unicode characters) returns `{"items":[],"total":0}` with 200. Max 100 characters |

- Matching is the same as the store's `q`, so `total` equals what `GET /products?q=...` would return.
- Items are ordered by prefix matches first, then fuzzy similarity, then best sellers.
- `200`:
```ts
interface ProductSuggestionsResponse {
  items: ProductSuggestion[]; // at most 6
  total: number;              // all matches, for a "Show all N results" link -> /products?q=...
}
interface ProductSuggestion {
  slug: string;
  title: string;
  imageUrl: string;
  isDlc: boolean;          // show a DLC badge
  basePriceCents: number;
  currency: string;        // currency of basePriceCents
  price: Price;            // cheapest buyable offer
}
```
- Errors: `400 validation_failed`, with `{ q: "is required" }` when `q` is absent or `{ q: "must be at most 100 characters" }`. `?q=` (empty) is fine.
- Debounce on the client. Each call does a database search.
```bash
curl 'http://localhost:8080/api/v1/products/suggestions?q=witc'
```

#### `GET /api/v1/products/{slug}`
- Public. Path param `slug`.
- The fixed paths `/products/filters` and `/products/suggestions` take precedence over `{slug}`.
- `200`:
```ts
interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  type: ProductType;
  platform: Platform;
  region: Region;
  developer: string | null;
  publisher: string | null;
  releaseDate: string;      // "YYYY-MM-DD"
  basePriceCents: number;
  currency: string;         // currency of basePriceCents
  genres: { slug: string; name: string }[]; // sorted by name, can be []
  offers: Offer[];          // only BUYABLE offers (active and in stock); can be [] (out of stock, but the page still works)
}
interface Offer {
  id: string;   // UUID. This is what you add to the cart (offerId)
  price: Price; // discountPercent vs. the product's basePriceCents
  seller: {
    id: string;
    name: string;
    logoUrl: string | null;
    rating: number;  // 0 to 10, a float
  };
}
```
- Offers are sorted by price ascending, then seller rating descending, then id. The intended UI shows the first two as "recommended".
- Errors: `404 not_found` for an unknown slug.
- The detail response doesn't include per-offer stock. Stock is visible in the cart (`availableQuantity`) or through `409 insufficient_stock`.
```bash
curl http://localhost:8080/api/v1/products/elden-ring-pc-steam-key-global
```

---

### 5.5 Cart

The cart is **public and cookie-based**:
- The cart is identified by the HttpOnly `cart_token` cookie. The cookie is **set automatically by the first `POST /cart/items`**.
- Always use `credentials: 'include'`.
- Every mutation except `DELETE /cart` returns the **full updated cart**, so you don't need to refetch.
- Prices and stock are read **live** from the offers. They are only fixed at checkout.

```ts
interface CartResponse {
  items: CartItem[];  // in the order they were added; [] when empty
  itemCount: number;  // sum of quantities (for the cart badge)
  totalCents: number; // sum of priceCents × quantity
  currency: string;   // "EUR" (also for an empty cart)
}
interface CartItem {
  offerId: string;           // UUID, the item key used in PATCH/DELETE paths
  quantity: number;          // 1..10
  availableQuantity: number; // keys this cart can buy right now; cap the "+" button with it. 0 if the offer is inactive
  available: boolean;        // false when checkout would fail for this line: offer inactive, or quantity > availableQuantity
  priceCents: number;        // one key at the offer's current price (line total = priceCents × quantity, computed client-side)
  currency: string;
  product: {
    slug: string;
    title: string;
    imageUrl: string;
    isDlc: boolean;
  };
  seller: {
    name: string;
    logoUrl: string | null;
  };
}
```
Limits:
- One cart line per offer.
- At most **10** keys per offer (`quantity` 1–10).
- Stock is checked on add and update against `availableQuantity`.
- **Warn before checkout**: show a warning on lines with `available: false`.
  - If `availableQuantity === 0`, the offer is inactive or sold out. Ask the user to remove the line.
  - Otherwise ask them to lower the quantity to `availableQuantity`.
  - It's sensible to disable the checkout button while any line is unavailable.
- Keys reserved by **this cart's own** pending checkout count as available to this cart. A new checkout cancels the previous one first, so they're freed. After a cancelled Stripe payment, the cart doesn't look sold out to its own user.

#### `GET /api/v1/cart`
- Public. Never creates a cart or sets a cookie.
- `200` returns `CartResponse`. Without a cookie (or with an unknown or invalid cart id) it returns the empty cart: `{"items":[],"itemCount":0,"totalCents":0,"currency":"EUR"}`.
```bash
curl -b cookies.txt http://localhost:8080/api/v1/cart
```

#### `POST /api/v1/cart/items`
- Public. Adds **one key** of an offer, which is one click on "Add to cart". If the offer is already in the cart, its quantity goes up by 1.
- Body: `{ "offerId": "<uuid>" }` (required).
- `200` returns `CartResponse` and sets or renews the `cart_token` cookie. It creates the cart on the first add.
- Errors:
  - `400 bad_request`
  - `400 validation_failed`, with `{offerId: "is required" | "must be a valid UUID" | "must not be the nil UUID"}` or `{quantity: "a cart can hold at most 10 keys of one offer, it already has 10"}`
  - `404 not_found`, for an unknown or inactive offer
  - `409 insufficient_stock` `{availableQuantity}`
```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:8080/api/v1/cart/items \
  -H 'Content-Type: application/json' -d '{"offerId":"f26f9e4f-2b98-405d-9b59-c9044d33566c"}'
```

#### `PATCH /api/v1/cart/items/{offerId}`
- Public. **Sets** the quantity to an absolute value, so a retried request is safe.
- Body: `{ "quantity": number }`, required, an integer from 1 to 10. Use DELETE to remove an item. `0` is rejected.
- `200` returns `CartResponse` and renews the cookie.
- Errors:
  - `400 bad_request` (e.g. quantity not a number)
  - `400 validation_failed`, with `{offerId: ...}` or `{quantity: "is required" | "must be between 1 and 10"}`
  - `404 not_found`, when there's no cart cookie, the cart is unknown, or the offer is not in the cart
  - `409 insufficient_stock` `{availableQuantity}`
```bash
curl -b cookies.txt -c cookies.txt -X PATCH http://localhost:8080/api/v1/cart/items/$OFFER_ID \
  -H 'Content-Type: application/json' -d '{"quantity":2}'
```

#### `DELETE /api/v1/cart/items/{offerId}`
- Public. No body. Removes the line.
- `200` returns `CartResponse` and renews the cookie.
- Errors:
  - `400 validation_failed` `{offerId}`
  - `404 not_found`, when there's no cart cookie, the cart is unknown, or the offer is not in the cart
```bash
curl -b cookies.txt -c cookies.txt -X DELETE http://localhost:8080/api/v1/cart/items/$OFFER_ID
```

#### `DELETE /api/v1/cart`
- Public. Empties the cart. The cart and its cookie are kept and reused by the next add.
- Always `204 No Content` with **no body**, even without a cookie or cart. Set your local cart state to empty yourself.
```bash
curl -b cookies.txt -c cookies.txt -X DELETE http://localhost:8080/api/v1/cart
```

---

### 5.6 Checkout (Stripe)

#### `POST /api/v1/checkout`
- **Auth required**, plus the `cart_token` cookie, so it needs `credentials: 'include'` and the Bearer header. **No body.**
- In one transaction, it:
  - locks the cart,
  - re-checks every offer (it must be active) and its stock,
  - **reserves** keys (they're held for 35 minutes),
  - and creates a `pending` order. Prices are fixed at this moment.

  It then creates a Stripe Checkout session, which expires after 31 minutes.
- **One pending order per cart.** If the cart already has a pending order (e.g. the user cancelled on Stripe and clicks checkout again), the backend:
  1. expires that order's Stripe session first, so the old payment page can't be paid any more;
  2. then, in the same transaction as the new order, marks the old order `cancelled` and releases its keys.

  The old order stays in `/orders` as `cancelled`. If the old session turns out to be already paid, no new order is created and the response is `409 checkout_already_completed` with `details.orderId`.
- **The cart is NOT emptied here.** It is emptied by the backend only when the payment succeeds (webhook). If the user cancels on Stripe and comes back to `/cart`, the cart is still full.
- `201`:
```ts
interface CheckoutResponse {
  orderId: string;     // UUID of the new pending order
  checkoutUrl: string; // https://checkout.stripe.com/... -> do window.location.href = checkoutUrl
}
```
- Stripe then redirects to `${FRONTEND_URL}/orders/${orderId}?paid=1` (success) or `${FRONTEND_URL}/cart` (cancel). See §1.
- Errors:
  - `401 unauthorized` / `invalid_token`
  - `400 cart_empty`, for no cookie, an unknown cart, or a cart with no items
  - `409 offer_unavailable` `{offerId}`: an offer was deactivated. Tell the user and remove that item
  - `409 insufficient_stock` `{offerId, availableQuantity}`: lower the quantity or remove the item
  - `409 checkout_already_completed` `{orderId}`: the cart's previous checkout was already paid. Navigate to `/orders/{orderId}` (it becomes `paid` and the cart is emptied by the webhook)
  - `409 checkout_superseded`: a newer checkout of the same cart (double click) replaced this request. Ignore this response if the other one succeeded, otherwise retry
  - `502 payment_provider_error`: a Stripe call failed. It's safe to retry
- If the user abandons payment without checking out again, the pending order stays `pending` (visible in `/orders`) until the Stripe session expires (about 31 min). It then becomes `cancelled` and its keys are released.
- Disable the checkout button while the request is in flight, to avoid `checkout_superseded`.
- Test card (Stripe sandbox): `4242 4242 4242 4242`, any future expiry date, CVC and name.
```bash
curl -i -b cookies.txt -X POST http://localhost:8080/api/v1/checkout -H "Authorization: Bearer $TOKEN"
```

#### `POST /api/v1/webhooks/stripe`: BACKEND-ONLY, the frontend must NEVER call it
- Called by Stripe and authenticated by the `Stripe-Signature` header (not a bearer token). The body is limited to 64 KB.
- Events handled:
  - `checkout.session.completed` with `payment_status: "paid"` marks the order `paid`, sells the keys, increments sold counts and **empties the cart** that was checked out.
  - `checkout.session.expired` marks a pending order `cancelled`, deletes its items and releases the keys.
  - Every other event, or an unpaid session, is ignored.
- It's idempotent: a repeated delivery changes nothing.
- A `completed` event for an order that is already `cancelled` (superseded or expired) sells nothing. It is logged for a manual refund. This shouldn't happen, because sessions are expired before their orders are cancelled.
- Responses:
  - `200` with an empty body for an event that was handled, ignored, or has no matching order.
  - `400 invalid_signature` / `bad_request`.
  - `500`, which makes Stripe retry.
- Local dev: `stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe`. Without it, orders stay `pending` forever locally.

---

### 5.7 Orders

#### `GET /api/v1/orders`
- **Auth required.** Lists the signed-in user's orders with **all statuses** (pending, paid, cancelled), newest first (`createdAt` desc).

| Param | Type | Notes |
|---|---|---|
| `publicId` | string | Optional, trimmed. **Partial**, case-insensitive match on the order's `publicId` (e.g. `k3x`, `O-K3`). Max 32 characters |
| `page` | int ≥ 1 | default 1 |
| `limit` | int 1–60 | default 10 |

- `200` returns `Paginated<OrderListItem>`:
```ts
interface OrderListItem {
  id: string;                  // UUID, use it for /orders/{id}
  publicId: string;            // "o-xxxxxxx", show this as the order number
  createdAt: string;           // RFC 3339
  status: OrderStatus;
  productTitle: string | null; // title of the order's FIRST item; null for CANCELLED orders (their items are deleted)
  itemCount: number;           // number of keys in the order; 0 for cancelled orders
  totalCents: number;
  currency: string;
}
```
- `productTitle` is only the first item. Use `itemCount` for a label such as "Elden Ring + 2 more" (`itemCount - 1` more).
- Errors:
  - `401`
  - `400 validation_failed`, with keys `page`, `limit`, `publicId` (`"must be at most 32 characters"`)
```bash
curl 'http://localhost:8080/api/v1/orders?page=1&limit=10&publicId=o-k3' -H "Authorization: Bearer $TOKEN"
```

#### `GET /api/v1/orders/{id}`
- **Auth required.** Path `id` is the order **UUID**, not `publicId`.
- `200`:
```ts
interface OrderDetail {
  id: string;
  publicId: string;
  createdAt: string;
  paidAt: string | null;   // null until paid (it's set exactly when status === 'paid')
  status: OrderStatus;
  sellerNames: string[];   // distinct seller names in first-appearance order; [] for cancelled
  totalCents: number;
  currency: string;
  items: OrderDetailItem[];// ONE ITEM PER KEY (2 keys of the same offer = 2 items, no quantity field); [] for cancelled
}
interface OrderDetailItem {
  id: string;             // order item UUID (NOT the digital key id)
  title: string;          // product title
  imageUrl: string;
  unitPriceCents: number; // the price paid, fixed at checkout
  currency: string;       // same as the order's currency
  sellerName: string;
}
```
  If you want to show "×2", group the items by title, seller and price on the client.
- Errors:
  - `401`
  - `400 validation_failed` `{id: "must be a valid UUID" | "must not be the nil UUID"}`
  - `404 not_found`, for an unknown id or **another user's order** (the two are deliberately indistinguishable)
- This is the Stripe success landing page (`?paid=1`). Poll it until `status` is `paid`; see §1.
```bash
curl http://localhost:8080/api/v1/orders/$ORDER_ID -H "Authorization: Bearer $TOKEN"
```

#### `GET /api/v1/orders/{id}/keys`
- **Auth required.** Path `id` is the order UUID. **Returns the DECRYPTED key codes, for paid orders only.**
- The response always carries `Cache-Control: no-store`. **Don't cache codes** (no localStorage or persistent query cache), don't log them and don't send them to analytics. Fetch them when the keys page opens and keep them only in memory.
- `200`:
```ts
interface OrderKeysResponse {
  orderId: string;
  keys: OrderKey[];   // same order as the order's items; [] is possible in theory
}
interface OrderKey {
  id: string;         // DIGITAL KEY UUID, the same as KeyListItem.id from GET /keys
  code: string;       // plaintext key code, e.g. "XXXX-XXXX-XXXX"
  product: {
    title: string;
    imageUrl: string;
    type: ProductType;
    platform: Platform;
    region: Region;
  };
  seller: {
    name: string;
    logoUrl: string | null;
    rating: number;   // 0 to 10
  };
}
```
  The response doesn't include `publicId`. Get it from `GET /orders/{id}` if you need it.
- Errors:
  - `401`
  - `400 validation_failed` `{id}`
  - `404 not_found`, for an unknown order or another user's order
  - **`409 order_not_paid` `{status: "pending" | "cancelled"}`**. Show "payment not completed yet" (pending) or "order cancelled" (cancelled). Don't show it as a generic error.
- **Preselecting a key**:
  - The agreed design is for the frontend page to read a `?key=<digitalKeyId>` query parameter (e.g. from the keys library) and highlight or scroll to the matching `OrderKey.id`.
  - The backend **ignores** any `key` parameter; this endpoint always returns all keys of the order.
  - The frontend route name and shape are the frontend's choice.
```bash
curl -i http://localhost:8080/api/v1/orders/$ORDER_ID/keys -H "Authorization: Bearer $TOKEN"
```

---

### 5.8 Keys library

#### `GET /api/v1/keys`
- **Auth required.** Lists every key from the user's **paid** orders (one row per key), **without codes**.
- Sorted by `purchasedAt` desc (newest purchases first), then by item order.

| Param | Type | Notes |
|---|---|---|
| `q` | string | Optional, trimmed. Partial, case-insensitive match on the **product title OR the order `publicId`**. Max 100 characters |
| `page` | int ≥ 1 | default 1 |
| `limit` | int 1–60 | default 10 |

- `200` returns `Paginated<KeyListItem>`:
```ts
interface KeyListItem {
  id: string;              // digital key UUID (matches OrderKey.id)
  orderId: string;         // order UUID -> GET /orders/{orderId}/keys
  publicId: string;        // order number
  purchasedAt: string;     // RFC 3339, when the order was paid
  sellerName: string;
  productTitle: string;
  productImageUrl: string;
  priceCents: number;      // price paid for this key
  currency: string;        // the order's currency
}
```
- Errors:
  - `401`
  - `400 validation_failed`, with keys `page`, `limit`, `q` (`"must be at most 100 characters"`)
- A "View key" link: open the order keys page for `orderId` with `?key=<id>`. The page calls `GET /api/v1/orders/{orderId}/keys` and highlights the key whose `id` matches. See §5.7.
```bash
curl 'http://localhost:8080/api/v1/keys?q=elden&page=1&limit=10' -H "Authorization: Bearer $TOKEN"
```

---

## 6. Typical flows

### Browse → cart → checkout → Stripe → return → order → keys
1. Home: `GET /api/v1/home`. Render the blocks. A "Show all" link uses `block.productTypes` as repeated `type` filters.
2. Store: `GET /api/v1/products/filters` once for the sidebar, then `GET /api/v1/products?...` as filters, sort and page change. The search box uses `GET /api/v1/products/suggestions?q=` (debounced, ≥ 3 characters).
3. Product page: `GET /api/v1/products/{slug}`. Show `offers` (cheapest first). If `offers` is empty, show "out of stock".
4. Add to cart: `POST /api/v1/cart/items {offerId}` with `credentials: 'include'`. The cookie is set automatically. Use the returned cart for the badge (`itemCount`).
5. Cart page: `GET /api/v1/cart`. Use `PATCH` to change quantity (cap it with `availableQuantity`) and `DELETE /items/{offerId}` to remove a line. Warn on lines with `available: false` before checkout.
6. Checkout button. The user must be logged in; otherwise send them to login first, and the cart cookie survives login. Call `POST /api/v1/checkout` (Bearer + credentials), then `window.location.href = checkoutUrl`. Handle `cart_empty`, `offer_unavailable` (`details.offerId`), `insufficient_stock` (`details.offerId`, `details.availableQuantity`), `checkout_already_completed` (`details.orderId`), `checkout_superseded` and `payment_provider_error`.
7. On Stripe:
   - If the user pays, Stripe redirects to `/orders/{orderId}?paid=1`. If they cancel, it redirects to `/cart` and the cart is unchanged.
   - On the success page, call `GET /api/v1/orders/{orderId}` and poll while `status === 'pending'`.
   - Once the order is `paid`, the cart has been emptied server-side, so refetch `GET /api/v1/cart` (or reset the badge).
8. Order detail: show `publicId`, `status`, `paidAt`, `sellerNames` and `items`. For paid orders, add a "View keys" link to the order keys page.
9. Order keys page: `GET /api/v1/orders/{id}/keys`. It returns plaintext codes, so don't cache them. `409 order_not_paid` means the order is pending or cancelled.

### Keys library → view a key
1. `GET /api/v1/keys?q=&page=` lists the purchased keys (no codes).
2. "View key" navigates to the order keys page for `item.orderId` with `?key=item.id`. This is the frontend's own routing, e.g. `/orders/{orderId}/keys?key={keyId}`.
3. That page calls `GET /api/v1/orders/{orderId}/keys` and highlights the `OrderKey` with `id === key`. The backend ignores `key`.

### Orders history
- `GET /api/v1/orders?page=&publicId=` → click a row → `GET /api/v1/orders/{id}`.
- Cancelled orders have `productTitle: null` in the list, and `items: []` and `sellerNames: []` in the detail. Render a fallback such as "Cancelled order".

### Session bootstrap
- On app load, call `POST /api/v1/auth/refresh` (credentials).
  - `200`: store `accessToken` and `user`.
  - `401`: the user is a guest.
- Use a single-flight refresh on `401 invalid_token` from protected calls.
- Logout: `POST /api/v1/auth/logout`, then drop the token. The cart is not affected.
