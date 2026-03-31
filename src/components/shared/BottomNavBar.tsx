import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const tabs = [
  { label: 'Explore', icon: 'explore', path: '/' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
  { label: 'Orders', icon: 'receipt_long', path: '/orders' },
  // { label: 'Support', icon: 'contact_support', path: '/help' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

export default function BottomNavBar() {
  const location = useLocation();
  const { state } = useCart();
  const cartCount = state.totalItems;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-50">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.label}
            to={tab.path}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-transform duration-200 active:scale-90 rounded-2xl ${tab.label === 'Cart' ? 'nav-cart-target ' : ''}${isActive
              ? 'bg-orange-50 text-orange-600'
              : 'text-neutral-400 hover:text-orange-500'
              }`}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}
              >
                {tab.icon}
              </span>
              {tab.label === 'Cart' && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ fontFamily: 'var(--font-headline)' }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
