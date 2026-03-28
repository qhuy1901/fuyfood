import { useState, useRef } from 'react';
import type { FlashSaleItem } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { triggerFlyToCartAnimation } from '../../utils/animations';

interface FlashSaleCardProps {
  readonly item: FlashSaleItem;
}

export default function FlashSaleCard({ item }: FlashSaleCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if any

    addItem({
      productId: item.id,
      name: item.name,
      image: item.imageUrl,
      basePrice: item.price,
      restaurantId: 'flash_sale_store', // Generic ID for platform flash sales
      restaurantName: 'FuyFood Flash Sale',
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    triggerFlyToCartAnimation(imgRef.current, item.imageUrl);
  };

  return (
    <div className="snap-start min-w-[280px] md:min-w-[320px] bg-[var(--color-surface-container-lowest)] rounded-2xl p-3 shadow-sm group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative h-44 rounded-xl overflow-hidden mb-3">
        <img
          ref={imgRef}
          alt={item.name}
          src={item.imageUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 bg-[var(--color-secondary)] text-white px-3 py-1 rounded-full font-black text-sm">
          -{item.discountPct}%
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all z-10 ${added
              ? 'bg-green-500 text-white scale-95'
              : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)]'
            }`}
        >
          <span className="material-symbols-outlined text-[24px]">{added ? 'check' : 'add'}</span>
        </button>
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
