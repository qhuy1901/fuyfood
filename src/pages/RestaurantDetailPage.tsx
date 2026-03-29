import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import ImageWithFallback from '../components/shared/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { triggerFlyToCartAnimation } from '../utils/animations';
import { urbanUmamiMenu, urbanUmamiReviews, type MenuItem } from '../data/mockData';
import CustomerReviews from '../components/CustomerReviews';

const menuSections = ['Popular Now', 'Sushi Rolls', 'Signature Ramen', 'Appetizers', 'Beverages', 'Desserts'];

export default function RestaurantDetailPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Popular Now');
  const { state, addItem } = useCart();
  const restaurantId = 'urban-umami';
  const restaurantName = 'Urban Umami';

  const handleAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addItem({
      productId: item.id,
      restaurantId,
      restaurantName,
      name: item.name,
      image: item.imageUrl,
      basePrice: item.price,
      quantity: 1,
    });
    triggerFlyToCartAnimation(e.currentTarget as HTMLElement, item.imageUrl);
  };

  const filtered = urbanUmamiMenu.filter(item =>
    activeSection === 'Popular Now' ? item.section === 'Popular Now' : item.section === activeSection
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar />

      <main className="max-w-screen-2xl mx-auto pb-32">
        {/* Hero Banner */}
        <section className="relative h-[250px] md:h-[400px] w-full overflow-hidden mb-4 md:mb-8 md:rounded-b-xl">
          <ImageWithFallback
            alt="Urban Umami restaurant"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXSoMb24Pdb5a9fg5Zxo0DXH0sGPxWNLSoR-6NIc7RZ5y53GeC3uqrtNOevZNG4RuiDkrbcpmByPyfoYpT1XcSi336dL6mLV-45FxIWbf2qG6OzxBPcR1WFWyA_X1qtEWkQIVnn8gcSnwHwTcEWtnPnn_Pcfe5EiyuFK61D5HK7m2WsNeIfb3xK6aWks-UM76ieKNHz03YZWPETrNJ__0pXZA9U_owofCgT85HaVKYMACn88TbQpqELUlOy_lcHV-vspMqWYIFMbQI"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(27,28,28,0) 0%, rgba(27,28,28,0.8) 100%)' }} />
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[var(--color-primary)] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Premium Partner</span>
                <div className="flex items-center gap-1 bg-[var(--color-tertiary-container)] px-3 py-1 rounded-full text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[14px] fill-icon">star</span>
                  <span>4.9 (2.5k+)</span>
                </div>
              </div>
              <h1 className="font-black text-3xl md:text-6xl tracking-tight mb-1" style={{ fontFamily: 'var(--font-headline)' }}>Urban Umami</h1>
              <p className="text-white/80 font-medium flex items-center gap-4 text-sm md:text-base flex-wrap">
                <span>Japanese Fusion • Ramen • Sushi</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>10-15 min</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">distance</span>0.2 km</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all active:scale-95">
                <span className="material-symbols-outlined fill-icon">favorite</span>
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all active:scale-95">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </section>

        {/* Menu */}
        <div className="px-6 flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full md:w-64 md:sticky md:top-28 z-40 bg-[var(--color-surface)]">
            <div className="flex md:flex-col overflow-x-auto no-scrollbar gap-2 py-2">
              {['🔥 Popular Now', 'Sushi Rolls', 'Signature Ramen', 'Appetizers', 'Beverages', 'Desserts'].map(label => {
                const key = label.replace('🔥 ', '');
                return (
                  <button
                    key={label}
                    onClick={() => setActiveSection(key)}
                    className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm text-left transition-all ${activeSection === key
                        ? 'bg-[var(--color-primary)] text-white shadow-lg'
                        : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)]'
                      }`}
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Food List */}
          <div className="flex-1 space-y-12">
            {menuSections.map(section => {
              const items = urbanUmamiMenu.filter(i => i.section === section);
              if (activeSection !== 'Popular Now' && activeSection !== section && filtered.length > 0) return null;
              return (
                <section key={section}>
                  <h2 className="font-black text-2xl mb-6 tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-headline)' }}>
                    {section === 'Popular Now' ? '🔥 Popular Now' : section}
                    <div className="h-1 flex-1 bg-[var(--color-surface-container-high)] rounded-full" />
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="bg-[var(--color-surface-container-lowest)] p-3 md:p-4 rounded-2xl flex gap-3 md:gap-4 hover:shadow-xl transition-all group relative border border-transparent hover:border-[var(--color-outline-variant)]/20"
                      >
                        <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-xl">
                          <img alt={item.name} src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1 pr-10 md:pr-12">
                          <div>
                            <h3 className="font-bold text-base md:text-lg leading-tight mb-1" style={{ fontFamily: 'var(--font-headline)' }}>{item.name}</h3>
                            <p className="text-[var(--color-on-surface-variant)] text-xs md:text-sm line-clamp-2">{item.description}</p>
                          </div>
                          <span className="font-extrabold text-lg text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-headline)' }}>${item.price.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={(e) => handleAdd(e, item)}
                          className="absolute bottom-4 right-4 bg-[var(--color-primary)] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="px-6">
          <CustomerReviews reviews={urbanUmamiReviews} />
        </div>
      </main>

      {/* Sticky Cart Bar */}
      <div className="fixed bottom-20 md:bottom-0 left-0 w-full z-40 px-4 pb-4 md:pb-8 pt-2 md:pt-4 pointer-events-none">
        <div className="max-w-screen-xl mx-auto bg-neutral-900 text-white rounded-2xl shadow-2xl flex items-center justify-between p-4 md:p-5 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined text-3xl">shopping_bag</span>
              <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900">{state.totalItems ?? 0}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-none mb-1">Basket Total</p>
              <p className="font-black text-xl" style={{ fontFamily: 'var(--font-headline)' }}>${Number(state.totalPrice ?? 0).toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] px-8 py-3 rounded-xl font-black text-sm tracking-tight transition-all active:scale-95 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            View Cart
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
