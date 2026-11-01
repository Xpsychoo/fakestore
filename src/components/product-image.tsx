import Image from "next/image";

/** Product photos have white backgrounds, so they always sit on white, even in dark mode. */
export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-[12%]" />
    </div>
  );
}
