import { useState } from 'react';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import CategoryChip from '../components/shared/CategoryChip';
import FlashSaleCard from '../components/shared/FlashSaleCard';
import RestaurantCard from '../components/shared/RestaurantCard';
import { categories, flashSaleItems, popularRestaurants, trendingRestaurants } from '../data/mockData';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [timeLeft] = useState('02:14:55');

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavBar />

      <main className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-24 md:pb-12">
        {/* Search */}
        <section className="sticky top-[72px] z-40 py-4 bg-[var(--color-background)]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">search</span>
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface-container-lowest)] border-none rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 placeholder:text-[var(--color-on-surface-variant)]/60 font-medium"
              placeholder="Craving ramen, pizza, or sushi?"
              type="text"
            />
          </div>
        </section>

        {/* Category Grid */}
        <section className="mt-4 mb-8">
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
            <div className="grid grid-rows-2 grid-flow-col gap-x-8 gap-y-4">
              {categories.map(cat => (
                <CategoryChip
                  key={cat.label}
                  category={cat}
                  isActive={activeCategory === cat.label}
                  onClick={() => setActiveCategory(prev => prev === cat.label ? null : cat.label)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Flash Sale</h2>
              <div className="flex items-center gap-1 bg-[var(--color-primary)] text-white px-3 py-1 rounded-lg font-bold text-sm">
                <span className="material-symbols-outlined text-sm">timer</span>
                <span>{timeLeft}</span>
              </div>
            </div>
            <a className="text-[var(--color-primary)] font-bold text-sm hover:underline" href="#">View All</a>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-5 snap-x">
            {flashSaleItems.map(item => <FlashSaleCard key={item.id} item={item} />)}
          </div>
        </section>

        {/* Popular Near You */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Popular Near You</h2>
            <button className="flex items-center gap-2 bg-[var(--color-surface-container-high)] px-4 py-2 rounded-full font-semibold text-sm">
              <span>Filters</span>
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </section>

        {/* Trending Near You */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Trending Near You</h2>
              <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm fill-icon">trending_up</span>
                <span>Popular</span>
              </div>
            </div>
            <a className="text-[var(--color-primary)] font-bold text-sm hover:underline" href="#">View All</a>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x">
            {trendingRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} variant="scroll" />)}
          </div>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
