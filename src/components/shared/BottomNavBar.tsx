import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Explore', icon: 'explore', path: '/' },
  { label: 'Search', icon: 'search', path: '/search' },
  { label: 'Cart', icon: 'shopping_bag', path: '/checkout' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-50">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.label}
            to={tab.path}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-transform duration-200 active:scale-90 rounded-2xl ${
              isActive
                ? 'bg-orange-50 text-orange-600'
                : 'text-neutral-400 hover:text-orange-500'
            }`}
          >
            <span
              className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ fontFamily: 'var(--font-headline)' }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
