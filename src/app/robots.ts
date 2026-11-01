import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/account", "/orders/", "/login", "/wishlist"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
