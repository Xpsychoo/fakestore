import { Star } from "lucide-react";

export function Rating({ rate, count, size = "sm" }: { rate: number; count: number; size?: "sm" | "md" }) {
  const icon = size === "md" ? "size-4.5" : "size-3.5";
  return (
    <div className={`flex items-center gap-1.5 ${size === "md" ? "text-sm" : "text-xs"} text-muted`}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`${icon} text-star ${rate >= n - 0.25 ? "fill-current" : ""}`} strokeWidth={1.75} />
        ))}
      </span>
      <span>
        <span className="sr-only">Rated </span>
        {rate.toFixed(1)}
        <span className="sr-only"> out of 5,</span> ({count.toLocaleString("en-US")}
        <span className="sr-only"> reviews</span>)
      </span>
    </div>
  );
}
