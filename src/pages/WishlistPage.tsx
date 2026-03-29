import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import RestaurantCard from '../components/shared/RestaurantCard';
import { popularRestaurants, trendingRestaurants } from '../data/mockData';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, loading } = useWishlist();
  const { user } = useAuth();

  // Combine and deduplicate restaurants from mock data
  const allRestaurants = [...popularRestaurants, ...trendingRestaurants];
  const uniqueRestaurants = Array.from(new Map(allRestaurants.map(r => [r.id, r])).values());

  // Filter based on wishlist IDs
  const favoritedRestaurants = uniqueRestaurants.filter(r => wishlist.includes(r.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <TopNavBar />
        <main className="max-w-screen-md mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-neutral-300" style={{ fontSize: '4rem' }}>favorite</span>
          </div>
          <h1 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Sign in for your wishlist</h1>
          <p className="text-neutral-500 mb-10 max-w-sm mx-auto font-medium">Keep track of the restaurants you love and never miss a flavor by signing in to your account.</p>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
          >
            Go to Home
          </button>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavBar />

      <main className="pt-6 pb-28 max-w-screen-xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
              Saved Restaurants
            </h1>
            <p className="text-[var(--color-on-surface-variant)] mt-1 font-medium">
              {favoritedRestaurants.length} {favoritedRestaurants.length === 1 ? 'place' : 'places'} you loved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-4 animate-pulse h-64 border border-[var(--color-surface-container-low)]" />
            ))}
          </div>
        ) : favoritedRestaurants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-lowest)] p-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-5xl">
              <span>❤️</span>
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
              Your wishlist is empty
            </h2>
            <p className="max-w-md mx-auto text-[var(--color-on-surface-variant)] mb-8 font-medium">
              Save your favorite restaurants to find them easily next time. Explore the best flavors near you!
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 text-sm font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-200"
            >
              <span className="material-symbols-outlined">explore</span>
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
