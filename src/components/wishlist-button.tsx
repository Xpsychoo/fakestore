"use client";

import { Heart } from "lucide-react";
import { setWishlist, useWishlist } from "@/lib/store";

export function WishlistButton({ id, title, variant = "icon" }: { id: number; title: string; variant?: "icon" | "full" }) {
  const saved = useWishlist().includes(id);
  const toggle = () => setWishlist((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  const heart = <Heart className={`size-4.5 ${saved ? "fill-current text-danger" : ""}`} aria-hidden="true" />;

  if (variant === "full") {
    return (
      <button type="button" onClick={toggle} aria-pressed={saved} className="btn-secondary">
        {heart}
        {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${title} ${saved ? "from" : "to"} wishlist`}
      className="grid size-9 place-items-center rounded-full border border-line bg-surface/90 text-ink backdrop-blur hover:bg-sunken"
    >
      {heart}
    </button>
  );
}
