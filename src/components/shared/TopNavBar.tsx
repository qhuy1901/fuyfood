import { Link, useLocation } from 'react-router-dom';
import { useLocation as useUserLocation } from '../../hooks/useLocation';
import { useCart } from '../../context/CartContext';

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
  const activeNav = (path: string) =>
    location.pathname === path
      ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
      : 'text-neutral-600 hover:text-neutral-900 transition-colors';

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
            <a className="text-neutral-600 hover:text-neutral-900 transition-colors" href="#">Offers</a>
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
          {!simplified && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary-fixed)]">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRjDkTopnBnRbIM1cATM9hTXk_UOVzj1W1MgL2WjpelbxD7TkaTNGE8xv6CzA_q869milMn3KZWGFb8nN1RIbcTIucfEUrrJQNmuInp3vjFuK8uxEfkECan__IgQoeI14LuXukYM4ecWfVanvVgLgVSG-g1EG8CnJ-y2egbgAa-NEBU1tQ2MhzgDZkhKtqs0E7lNtCML1ZxmNcZQ3CZUWZbAgi_Ok_mMqUanhULU-I5pEnpb2JUor5PdxCfye5OA0bmDiFqXTaC8C0"
              />
            </div>
          )}
          {simplified && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary-fixed)]">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRjDkTopnBnRbIM1cATM9hTXk_UOVzj1W1MgL2WjpelbxD7TkaTNGE8xv6CzA_q869milMn3KZWGFb8nN1RIbcTIucfEUrrJQNmuInp3vjFuK8uxEfkECan__IgQoeI14LuXukYM4ecWfVanvVgLgVSG-g1EG8CnJ-y2egbgAa-NEBU1tQ2MhzgDZkhKtqs0E7lNtCML1ZxmNcZQ3CZUWZbAgi_Ok_mMqUanhULU-I5pEnpb2JUor5PdxCfye5OA0bmDiFqXTaC8C0"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
