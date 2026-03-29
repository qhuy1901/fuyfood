import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocation as useUserLocation } from '../../hooks/useLocation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface TopNavBarProps {
  readonly simplified?: boolean;
  readonly pageTitle?: string;
  readonly hideCartLink?: boolean;
  readonly actionButton?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
}

export default function TopNavBar({ simplified = false, pageTitle, hideCartLink = false, actionButton }: TopNavBarProps) {
  const { locationText, loadingLocation } = useUserLocation();
  const { state } = useCart();
  const cartCount = state.totalItems;
  const location = useLocation();
  const { openLoginModal, user, loading: authLoading, signOut } = useAuth();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeNav = (path: string) =>
    location.pathname === path
      ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
      : 'text-neutral-600 hover:text-neutral-900 transition-colors';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm glass-header">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-4">
          {simplified && (
            <button
              className="p-2 hover:bg-neutral-50 rounded-full transition-all"
              onClick={() => window.history.back()}
            >
              <span className="material-symbols-outlined text-neutral-900">arrow_back</span>
            </button>
          )}
          <Link to="/" className="text-2xl font-black italic text-orange-600 font-headline tracking-tight">
            FuyFood
          </Link>
          {!simplified && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-container-low)] rounded-full cursor-pointer min-w-[160px] max-w-[60vw] md:max-w-[280px] overflow-hidden">
              <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">location_on</span>
              <span className="text-xs font-semibold truncate max-w-[180px] md:max-w-[220px]">
                {loadingLocation ? 'Getting location...' : locationText}
              </span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </div>
          )}
        </div>

        {/* Center nav */}
        {!simplified ? (
          <nav className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
            <Link className={activeNav('/')} to="/">Explore</Link>
            <Link className={activeNav('/orders')} to="/orders">Orders</Link>
            <Link className={activeNav('/wishlist')} to="/wishlist">Wishlist</Link>
            <a className="text-neutral-600 hover:text-neutral-900 transition-colors" href="#">Help</a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-8">
            <span className="font-headline font-bold text-neutral-900">{pageTitle}</span>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {!simplified && (
            <button className="p-2 hover:bg-neutral-50 rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          )}
          {!hideCartLink && (
            <Link to="/cart" className="nav-cart-target p-2 hover:bg-neutral-50 rounded-lg transition-all active:scale-95 relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-5 rounded-full bg-[var(--color-primary)] text-[10px] font-black text-white flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              {actionButton.icon && <span className="material-symbols-outlined text-base">{actionButton.icon}</span>}
              <span className="text-xs font-bold">{actionButton.label}</span>
            </button>
          )}

          {authLoading ? (
            <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse ml-2" />
          ) : user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary)] transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <img
                  alt={user.user_metadata.full_name || 'User'}
                  className="w-full h-full object-cover"
                  src={user.user_metadata.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s96-c'}
                />
              </button>
              {/* Dropdown Menu */}
              <div className={`absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] py-3 transition-all duration-300 border border-neutral-50 z-[100] ${
                showDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}>
                <div className="px-5 py-3 border-b border-neutral-50 mb-2">
                  <p className="text-sm font-black text-neutral-800 truncate" style={{ fontFamily: 'var(--font-headline)' }}>
                    {user.user_metadata.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                </div>

                <div className="px-2 space-y-1">
                  <Link to="/profile" onClick={() => setShowDropdown(false)} className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors flex items-center gap-3 group/item">
                    <span className="material-symbols-outlined text-xl text-neutral-400 group-hover/item:text-[var(--color-primary)] transition-colors">person_outline</span>
                    <span className="font-bold">Profile & Settings</span>
                  </Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)} className="w-full text-left px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors flex items-center gap-3 group/item">
                    <span className="material-symbols-outlined text-xl text-neutral-400 group-hover/item:text-[var(--color-primary)] transition-colors">receipt_long</span>
                    <span className="font-bold">My Orders</span>
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-50 px-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 group/signout"
                  >
                    <span className="material-symbols-outlined text-xl text-red-400 group-hover/signout:text-red-600 transition-colors">logout</span>
                    <span className="font-black">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openLoginModal()}
              className="px-5 py-2 font-bold text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition-all active:scale-95 ml-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
