import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocation } from '../hooks/useLocation';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { popularRestaurants } from '../data/mockData';

// ---- Data (extracted from Stitch HTML) ----
interface NearbyRestaurant {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount: string;
  distance: string;
  deliveryTime: string;
  tags: string[];
  cuisine: string;
  promos: Array<{ text: string; color: 'primary' | 'tertiary' }>;
}

const nearbyRestaurants: NearbyRestaurant[] = popularRestaurants.map(r => ({
  id: r.id,
  name: r.name,
  imageUrl: r.imageUrl,
  rating: r.rating,
  reviewCount: '1k+',
  distance: r.distance,
  deliveryTime: r.deliveryTime,
  tags: r.tags,
  cuisine: r.cuisine,
  promos: r.isPromo ? [{ text: 'PROMO', color: 'primary' as const }] : r.isFreeShipping ? [{ text: 'FREE SHIPPING', color: 'tertiary' as const }] : [],
}));

const parseDistance = (distance: string): number => {
  const value = parseFloat(distance.replace(',', '.'));
  return distance.includes('m') ? value / 1000 : value;
};

const sortedNearbyRestaurants = [...nearbyRestaurants].sort(
  (a, b) => parseDistance(a.distance) - parseDistance(b.distance)
);

const FILTERS = ['Distance', 'Rating 4.5+', 'Fast Delivery', 'Free Shipping', 'Promo'];

// ---- Skeleton Card ----
function SkeletonCard({ opacity }: { opacity: number }) {
  return (
    <div className="space-y-3" style={{ opacity }}>
      <div className="aspect-video rounded-xl skeleton-shimmer" />
      <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />
      <div className="h-4 w-1/2 rounded-md skeleton-shimmer" />
      <div className="flex gap-2">
        <div className="h-4 w-14 rounded-full skeleton-shimmer" />
        <div className="h-4 w-14 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function RestaurantListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { locationText, loadingLocation } = useLocation();
  const { user, openLoginModal } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const categoryFilter = searchParams.get('category');

  const [activeFilter, setActiveFilter] = useState('Distance');
  const searchQuery = searchParams.get('search')?.trim();
  const normalizedSearch = searchQuery?.toLowerCase() ?? '';

  // Filter restaurants based on search or category
  const filteredRestaurants = (() => {
    if (searchQuery) {
      return sortedNearbyRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(normalizedSearch) ||
        restaurant.cuisine.toLowerCase().includes(normalizedSearch) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(normalizedSearch))
      );
    }

    if (!categoryFilter) return sortedNearbyRestaurants;

    const category = categoryFilter.toLowerCase();
    if (category === 'all') return sortedNearbyRestaurants;

    const matched = sortedNearbyRestaurants.filter(restaurant =>
      restaurant.tags.some(tag => tag.toLowerCase().includes(category)) ||
      restaurant.name.toLowerCase().includes(category)
    );

    if (matched.length >= 5) return matched;

    const supplement = sortedNearbyRestaurants.filter(
      restaurant => !matched.includes(restaurant)
    );

    return [...matched, ...supplement].slice(0, 5);
  })();

  const handleWishlistClick = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user) {
      openLoginModal();
      return;
    }

    await toggleWishlist(id);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavBar />

      <main className="pt-6 pb-28 max-w-screen-xl mx-auto px-4">
        {/* Location bar */}
        <section className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container-low)] rounded-xl cursor-pointer hover:bg-[var(--color-surface-container)] transition-colors">
            <span className="material-symbols-outlined text-[var(--color-primary)] fill-icon">location_on</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[var(--color-primary)] tracking-widest uppercase">Delivering To</p>
              <p className="text-sm font-semibold truncate">
                {loadingLocation ? 'Getting location...' : locationText}
              </p>
            </div>
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">chevron_right</span>
          </div>
        </section>

        {/* Filter pill row */}
        <section className="mb-8 -mx-4">
          <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar pb-1">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  activeFilter === filter
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[#b22204]/20'
                    : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
            <span className="font-bold text-[var(--color-on-surface)]">{filteredRestaurants.length}</span> restaurants found
            {categoryFilter && <span> for "{categoryFilter}"</span>}
          </p>
          <button className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
            More Filters
          </button>
        </div>

        {/* Restaurant list or empty state */}
        {filteredRestaurants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-surface-container-high)] bg-[var(--color-surface)] p-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-5xl">
              <span>🥺</span>
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
              No restaurants found
            </h2>
            <p className="max-w-xl mx-auto text-[var(--color-on-surface-variant)] mb-6">
              {searchQuery
                ? `We couldn’t find any restaurants matching "${searchQuery}". Try another cuisine, keyword, or clear your search.`
                : categoryFilter
                ? `No restaurants matched the selected category "${categoryFilter}". Try a different category or clear the filter.`
                : 'No restaurants are available right now. Please try again later.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/restaurants')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-container)]"
            >
              <span className="material-symbols-outlined">refresh</span>
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map(restaurant => (
              <article
                key={restaurant.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  alt={restaurant.name}
                  src={restaurant.imageUrl}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Promo badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {restaurant.promos.map(promo => (
                    <span
                      key={promo.text}
                      className={`text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg ${
                        promo.color === 'primary'
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-tertiary-container)]'
                      }`}
                    >
                      {promo.text}
                    </span>
                  ))}
                </div>

                {/* Favourite button */}
                <button
                  onClick={e => handleWishlistClick(restaurant.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      isInWishlist(restaurant.id) ? 'text-[var(--color-primary)] fill-icon' : 'text-[var(--color-on-surface)]'
                    }`}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Info */}
              <div className="px-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'var(--font-headline)' }}>
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] px-2 py-0.5 rounded-md gap-1 flex-shrink-0 ml-2">
                    <span className="material-symbols-outlined text-[14px] fill-icon">star</span>
                    <span className="text-xs font-bold">{restaurant.rating}</span>
                    <span className="text-[10px] opacity-70">({restaurant.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)] text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">distance</span>
                    <span>{restaurant.distance}</span>
                  </div>
                  <span className="w-1 h-1 bg-[var(--color-outline-variant)] rounded-full" />
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {restaurant.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {/* Skeleton loaders — suggest more results loading */}
          <SkeletonCard opacity={0.6} />
          <SkeletonCard opacity={0.4} />
          <SkeletonCard opacity={0.2} />
        </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
