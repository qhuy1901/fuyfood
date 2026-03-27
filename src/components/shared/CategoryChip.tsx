import { useNavigate } from 'react-router-dom';
import type { Category } from '../../data/mockData';

interface CategoryChipProps {
  readonly category: Category;
  readonly onClick?: () => void;
}

export default function CategoryChip({ category, onClick }: CategoryChipProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/restaurants?category=${encodeURIComponent(category.label)}`);
    }
  };
  return (
    <div
      className="flex flex-col items-center gap-2 group cursor-pointer min-w-[72px]"
      onClick={handleClick}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:bg-[var(--color-primary-fixed)] group-active:scale-90 bg-[var(--color-surface-container-high)]`}
      >
        <span className="text-3xl">{category.emoji}</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]" style={{ fontFamily: 'var(--font-label)' }}>
        {category.label}
      </span>
    </div>
  );
}
