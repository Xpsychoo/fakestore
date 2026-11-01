# Shopora: Demo Online Store

An online store built with Next.js on the free [Fake Store API](https://fakestoreapi.com). Browse and filter products, keep a wishlist, sign in with a sample account and check out. It's a demo, so no payment is taken and nothing ships.

## Features

- **Home page:** hero, category tiles and top-rated products
- **Product listing** (`/products`):
  - filter by category and price range, search text, and sort by price, rating or number of reviews
  - every filter lives in the URL, so results can be shared and bookmarked
  - filtering is a plain GET form, so it works before JavaScript loads
- **Product page:** large image, rating, quantity picker, add to cart, wishlist and related products, plus `Product` structured data for search engines
- **Cart:** change quantities, remove items, free-shipping progress bar (free over $100, otherwise $9.99)
- **Checkout:** validated delivery form; signed-in users can fill it from their saved address. The order is sent to the API's `POST /carts`
- **Sign in:** real Fake Store sample accounts, for example `johnd` / `m38rmF$`. The user's profile is loaded from `/users/:id`
- **Account:** profile, saved address and order history
- **Light and dark mode**, following the system setting
- **Accessible:** labelled controls, focus styles, screen-reader text for ratings and counts, and a skip link

## How it works

| Concern | Approach |
| --- | --- |
| Catalogue data | A copy of the API's 20 products in [`src/data/products.json`](src/data/products.json), with images in `public/images/products/`. All product pages are pre-rendered at build time |
| Images | Served through `next/image`, so they're resized and converted to modern formats |
| Login and checkout | [Called from the browser](src/lib/fakestore.ts). The API allows cross-origin requests, and the CSP allows only this site and `fakestoreapi.com` |
| Cart, wishlist, orders, session | Saved in `localStorage` through a small [`useSyncExternalStore` store](src/lib/store.ts). It syncs across tabs and avoids hydration mismatches |
| Saved data | Validated when it's read back, since anyone can edit `localStorage` |

**Why the catalogue is bundled:** fakestoreapi.com is behind Cloudflare, which blocks requests from cloud servers such as Vercel's build machines (they get `403`). Its catalogue never changes, so the app ships a copy and only calls the API from visitors' browsers. To refresh the copy, run `pnpm sync-catalog` on your own machine and commit the result.

**What Fake Store doesn't do:** the API accepts new carts but doesn't save them (every new cart gets the same id). The app therefore numbers orders itself and keeps the order history in the browser. Prices are in USD, as the API returns them.

## Tech

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide icons, Vitest and Testing Library.

```
src/
  app/          routes: home, products, product/[id], cart, checkout, login, account, wishlist, orders/[id]
  components/   UI: header, product card, filter bar, cart, checkout form…
  data/         bundled product catalogue
  lib/          catalogue access and filters, cart maths, validation, Fake Store API calls, browser store
scripts/        sync-catalog.mjs: refreshes the bundled catalogue and images
test/           unit and component tests
```

## Development

Requires Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm check      # lint, type check and tests
pnpm build      # production build
```

## Deploy

Import the repo into Vercel; the defaults work. No environment variables are needed. Set `NEXT_PUBLIC_SITE_URL` if you use a custom domain, so the sitemap and share links use it.
