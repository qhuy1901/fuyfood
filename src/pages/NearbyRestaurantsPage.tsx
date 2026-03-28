import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import ImageWithFallback from '../components/shared/ImageWithFallback';

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
  promos: Array<{ text: string; color: 'primary' | 'tertiary' }>;
}

const nearbyRestaurants: NearbyRestaurant[] = [
  {
    id: 'n1',
    name: 'Gourmet Burger Kitchen',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl07jc1R_1oiEzkm9kjHuN42-o3kYkYMzy-TPgQey-F5FJ8XJ3Hho2nj_amcemDsNBpHwrmD6v5CwF3mzXq2HZv3Itk9Z6IWryjCNiMsVa1LnaHmoZ0cp_0S6-0YtlDyaYRH20RlUNtYE2bmidCAK3PScbJurCtReIYMxBik0qfvfTtLBeN2_srqtUj34B1Nx8Ze-cYU1f4Uaf4l4pEcj_zXAlBeXAzLPIvrHxCINg6sdAAl0FrAnbzxHUnWH_pt7x91slj_YAFGUC',
    rating: 4.8,
    reviewCount: '1.2k+',
    distance: '1.2 km',
    deliveryTime: '15-25 min',
    tags: ['Burgers', 'American', 'Premium'],
    promos: [
      { text: '40% OFF', color: 'primary' },
      { text: 'FREE DELIVERY', color: 'tertiary' },
    ],
  },
  {
    id: 'n2',
    name: 'Napoli Pizza House',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHlGikLCT1MIWUkvUhLCIvxN_eILU1F90DFfakAWfeF4vMEfEmAH3LcnCI-lDot_qeZpgQJiJEoArlP8L18fZrHS6XUqbunmjkdnGru_wlvT9xgfpWDYauNz3ljs_v0v_I5dTmNK0A8ig9qT-zWfOKANeKQRcBKQc7jNPylyuwLAp3TeCEbXgXNCrkrDkUnN-T64SvVS8GeFsfm-C1RhJMeI_gJEtBcWWkMW0EUsBoopZXX4muHhY1sp0plH1Hs7Rj4qn9Ra5V0GnJ',
    rating: 4.6,
    reviewCount: '850',
    distance: '0.8 km',
    deliveryTime: '10-20 min',
    tags: ['Italian', 'Pizza'],
    promos: [{ text: 'BUY 1 GET 1', color: 'primary' }],
  },
  {
    id: 'n3',
    name: 'Sushiya Express',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcsJmZvwZn_RQpnCs1h9G8IvfpG96K2NpvUqPxgwY0VXoXn-QffVQ8_fXtEndohawCbSNCwfLd-MQrTSMzJYJENWfPhBXEYbREwzszdQFD4rE-MVq9IUSNnYYLMX1pl5MyflIXgKu2a8DuSJuHR8qQDGeTfCj46JVMdkUcdJ6pE6ACtgjxfQOkidkAHMzo9iDsoVmBCKxsTie6Tk4jAel5_2hzwEH4xCAsNAM6UQDap8agl0LVSJYqeLQLujZBvbqQhAudoYGuoXVO',
    rating: 4.9,
    reviewCount: '2.4k',
    distance: '2.5 km',
    deliveryTime: '30-45 min',
    tags: ['Japanese', 'Healthy'],
    promos: [{ text: 'PROMO CODE', color: 'tertiary' }],
  },
];

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
export default function NearbyRestaurantsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Distance');
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavourites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavBar simplified pageTitle="Nearby Restaurants" />

      <main className="pt-6 pb-28 max-w-screen-xl mx-auto px-4">
        {/* Location bar */}
        <section className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-container-low)] rounded-xl cursor-pointer hover:bg-[var(--color-surface-container)] transition-colors">
            <span className="material-symbols-outlined text-[var(--color-primary)] fill-icon">location_on</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[var(--color-primary)] tracking-widest uppercase">Delivering To</p>
              <p className="text-sm font-semibold truncate">221B Baker St, London, NW1 6XE, UK</p>
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
            <span className="font-bold text-[var(--color-on-surface)]">{nearbyRestaurants.length}</span> restaurants nearby
          </p>
          <button className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
            More Filters
          </button>
        </div>

        {/* Restaurant grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nearbyRestaurants.map(restaurant => (
            <article
              key={restaurant.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                <ImageWithFallback
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
                  onClick={e => toggleFav(restaurant.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      favourites.has(restaurant.id) ? 'text-[var(--color-primary)] fill-icon' : 'text-[var(--color-on-surface)]'
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
      </main>

      <BottomNavBar />
    </div>
  );
}
