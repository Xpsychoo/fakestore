"use client";

import { SlidersHorizontal } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRef } from "react";
import { categoryLabel, categorySlug, type Filters, filtersHref, SORTS } from "@/lib/catalog";

const chip = "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";
const chipOn = `${chip} border-brand bg-brand text-on-brand`;
const chipOff = `${chip} border-line bg-surface text-ink hover:bg-sunken`;

export function FilterBar({ filters, categories }: { filters: Filters; categories: string[] }) {
  const form = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-4">
      <nav aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={filtersHref(filters, { category: undefined })} className={filters.category ? chipOff : chipOn} aria-current={!filters.category ? "page" : undefined}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={filtersHref(filters, { category: c })}
            className={filters.category === c ? chipOn : chipOff}
            aria-current={filters.category === c ? "page" : undefined}
          >
            {categoryLabel(c)}
          </Link>
        ))}
      </nav>

      {/* A plain GET form, so filtering works before JavaScript loads. The key resets the
          fields when the filters change through a link instead of this form. */}
      <Form
        ref={form}
        key={JSON.stringify(filters)}
        action="/products"
        scroll={false}
        className="card grid gap-3 p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
      >
        {filters.category && <input type="hidden" name="category" value={categorySlug(filters.category)} />}
        <div>
          <label htmlFor="filter-q" className="label">
            Search
          </label>
          <input id="filter-q" name="q" type="search" defaultValue={filters.q} placeholder="e.g. jacket, ring, SSD" className="input" />
        </div>
        <fieldset className="flex items-end gap-2">
          <legend className="label">Price (USD)</legend>
          <input
            name="min"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            defaultValue={filters.min}
            placeholder="Min"
            aria-label="Minimum price"
            className="input w-24"
          />
          <span className="pb-2.5 text-muted" aria-hidden="true">
            –
          </span>
          <input
            name="max"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            defaultValue={filters.max}
            placeholder="Max"
            aria-label="Maximum price"
            className="input w-24"
          />
        </fieldset>
        <div>
          <label htmlFor="filter-sort" className="label">
            Sort by
          </label>
          <select id="filter-sort" name="sort" defaultValue={filters.sort} onChange={() => form.current?.requestSubmit()} className="input pr-8">
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Apply
        </button>
      </Form>
    </div>
  );
}
