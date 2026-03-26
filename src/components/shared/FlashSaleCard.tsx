import type { FlashSaleItem } from '../../data/mockData';

interface FlashSaleCardProps {
  readonly item: FlashSaleItem;
}

export default function FlashSaleCard({ item }: FlashSaleCardProps) {
  return (
    <div className="snap-start min-w-[280px] md:min-w-[320px] bg-[var(--color-surface-container-lowest)] rounded-2xl p-3 shadow-sm group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative h-44 rounded-xl overflow-hidden mb-3">
        <img
          alt={item.name}
          src={item.imageUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 bg-[var(--color-secondary)] text-white px-3 py-1 rounded-full font-black text-sm">
          -{item.discountPct}%
        </div>
      </div>
      <h3 className="font-bold text-lg leading-tight truncate" style={{ fontFamily: 'var(--font-headline)' }}>
        {item.name}
      </h3>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[var(--color-primary)] font-black text-xl">${item.price.toFixed(2)}</span>
        <span className="text-[var(--color-on-surface-variant)]/50 line-through text-sm">${item.originalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
