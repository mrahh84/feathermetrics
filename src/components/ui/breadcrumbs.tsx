import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string, href?: string }[] }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, idx) => (
        <span key={item.label}>
          {item.href ? (
            <Link href={item.href} className="hover:underline text-[#E0A96F]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#E0A96F] font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-1">›</span>}
        </span>
      ))}
    </nav>
  );
} 