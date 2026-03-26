import type { Category } from '../../data/mockData';

interface CategoryChipProps {
  readonly category: Category;
  readonly isActive?: boolean;
  readonly onClick?: () => void;
}

export default function CategoryChip({ category, isActive = false, onClick }: CategoryChipProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 group cursor-pointer min-w-[72px]"
      onClick={onClick}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:bg-[var(--color-primary-fixed)] group-active:scale-90 ${
          isActive ? 'bg-[var(--color-primary-fixed)]' : 'bg-[var(--color-surface-container-high)]'
        }`}
      >
        <span className="text-3xl">{category.emoji}</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]" style={{ fontFamily: 'var(--font-label)' }}>
        {category.label}
      </span>
    </div>
  );
}
