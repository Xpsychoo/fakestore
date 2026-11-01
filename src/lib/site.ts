export const SITE = {
  name: "Shopora",
  title: "Shopora: Clothing, Jewellery & Electronics",
  description:
    "A demo online store built with Next.js on the Fake Store API: browse, filter and search products, " +
    "keep a wishlist and check out. No real orders or payments.",
} as const;

export function getSiteUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return (process.env.NEXT_PUBLIC_SITE_URL || (host ? `https://${host}` : "http://localhost:3000")).replace(/\/+$/, "");
}
