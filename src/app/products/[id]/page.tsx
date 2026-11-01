import { ChevronRight, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { Rating } from "@/components/rating";
import { WishlistButton } from "@/components/wishlist-button";
import { getProduct, getProducts } from "@/lib/api";
import { FREE_SHIPPING_FROM, formatPrice } from "@/lib/cart";
import { categoryLabel, categorySlug, relatedProducts } from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(Number((await params).id));
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { images: [{ url: product.image, alt: product.title }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(Number((await params).id));
  if (!product) notFound();
  const related = relatedProducts(await getProducts(), product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.description,
    category: product.category,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.rate, reviewCount: product.rating.count },
    offers: { "@type": "Offer", price: product.price, priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="page space-y-14 py-8">
      <script
        type="application/ld+json"
        // Escape "<" so product text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            <li>
              <Link href="/products" className="hover:text-ink hover:underline">
                Products
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <Link href={`/products?category=${categorySlug(product.category)}`} className="hover:text-ink hover:underline">
                {categoryLabel(product.category)}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <ProductImage
            src={product.image}
            alt={product.title}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="card aspect-square md:sticky md:top-32"
          />

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl">{product.title}</h1>
              <Rating rate={product.rating.rate} count={product.rating.count} size="md" />
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <p className="leading-relaxed text-muted">{product.description}</p>

            <div className="space-y-3 border-y border-line py-6">
              <AddToCart product={product} />
              <WishlistButton id={product.id} title={product.title} variant="full" />
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <Truck className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">Free shipping</strong> on orders over {formatPrice(FREE_SHIPPING_FROM)}. Delivered in 3–5
                  working days.
                </span>
              </li>
              <li className="flex gap-3">
                <RotateCcw className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">30-day returns</strong> if it isn&apos;t quite right.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-5">
          <h2 id="related-heading" className="text-2xl font-bold tracking-tight">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
