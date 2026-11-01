"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/lib/cart";

export function QuantityStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const button = "grid size-9 place-items-center text-ink hover:bg-sunken disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-line bg-surface" role="group" aria-label={label}>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output className="w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
