import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../../data/mockData';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ImageWithFallback from './ImageWithFallback';

interface RestaurantCardProps {
  readonly restaurant: Restaurant;
  readonly variant?: 'grid' | 'scroll';
}

export default function RestaurantCard({ restaurant, variant = 'grid' }: RestaurantCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openLoginModal } = useAuth();
  const scrollClass = variant === 'scroll' ? 'snap-start min-w-[300px] md:min-w-[400px]' : '';

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openLoginModal();
      return;
    }
    await toggleWishlist(restaurant.id);
  };

  const isFavorited = isInWishlist(restaurant.id);

  return (
    <div
      className={`group cursor-pointer ${scrollClass}`}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="aspect-video rounded-2xl overflow-hidden relative mb-4">
        <ImageWithFallback
          alt={restaurant.name}
          src={restaurant.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-lg z-10"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isFavorited ? 'text-[var(--color-primary)] fill-icon' : 'text-neutral-400'
            }`}
          >
            favorite
          </span>
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {restaurant.isFreeShipping && (
            <span className="bg-[var(--color-primary)] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
              Free Shipping
            </span>
          )}
          {restaurant.isPromo && (
            <span className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
              Promo
            </span>
          )}
          {restaurant.isTopRated && (
            <span className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
              Top Rated
            </span>
          )}
          {restaurant.ordersToday && (
            <span className="bg-[var(--color-primary)] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">
              {restaurant.ordersToday} orders today
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            {restaurant.name}
          </h3>
          <p className="text-sm text-[var(--color-on-surface-variant)] font-medium mt-1">{restaurant.cuisine}</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-surface-container-high)] px-2 py-1 rounded-lg h-fit">
          <span className="material-symbols-outlined text-sm text-[var(--color-tertiary-container)] fill-icon">star</span>
          <span className="font-black text-sm">{restaurant.rating}</span>
        </div>
      </div>

      {restaurant.deliveryTime && (
        <div className="flex items-center gap-4 mt-3 px-1 text-xs font-bold text-[var(--color-on-surface-variant)]/70 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">distance</span>
            <span>{restaurant.distance}</span>
          </div>
        </div>
      )}
    </div>
  );
}
