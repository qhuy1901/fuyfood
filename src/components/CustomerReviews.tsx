import React from 'react';
import type { Review } from '../data/mockData';

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  const averageRating = 4.9;
  const totalReviews = 2500;

  const ratingDistribution = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <section className="mt-16 pb-16 border-t border-[var(--color-surface-container-high)] pt-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Summary */}
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-black mb-8 tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Customer Reviews
          </h2>

          <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-3xl shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
            <div className="text-center mb-8">
              <div className="text-7xl font-black text-[var(--color-on-surface)] leading-none mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                {averageRating}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-[var(--color-tertiary-fixed-dim)] fill-icon text-2xl">
                    star
                  </span>
                ))}
              </div>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-medium">
                out of 5 stars • {totalReviews.toLocaleString()} Reviews
              </p>
            </div>

            {/* Bars */}
            <div className="space-y-4">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <span className="text-xs font-bold w-12 text-right text-[var(--color-on-surface-variant)]">
                    {item.stars}-star
                  </span>
                  <div className="flex-1 h-2 bg-[var(--color-surface-container-high)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-on-surface)] rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-10 text-[var(--color-on-surface-variant)]">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Review List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <button className="px-5 py-2.5 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-bold text-sm">
                Most Recent
              </button>
              <button className="px-5 py-2.5 rounded-full text-[var(--color-on-surface-variant)] font-bold text-sm hover:bg-[var(--color-surface-container-high)] transition-all">
                Highest Rating
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
              <span>Filter by</span>
              <select className="bg-transparent font-bold text-[var(--color-on-surface)] outline-none border-none cursor-pointer">
                <option>All Stars</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--color-surface-container-lowest)] p-6 rounded-3xl border border-[var(--color-surface-container-low)] shadow-[0_4px_12px_rgba(27,28,28,0.03)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-surface-container-high)]">
                    <img src={review.userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} alt={review.userName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--color-on-surface)] leading-tight">{review.userName}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-black opacity-60">Verified Order • {review.date}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`material-symbols-outlined text-sm ${s <= review.rating ? 'text-[var(--color-tertiary-fixed-dim)] fill-icon' : 'text-gray-200'}`}
                    >
                      star
                    </span>
                  ))}
                </div>

                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4 italic line-clamp-3">
                  "{review.comment}"
                </p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="review"
                        className="w-16 h-16 rounded-xl object-cover hover:scale-110 transition-all cursor-pointer shadow-sm"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-surface-container)]">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-all">
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    Helpful (3)
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40 hover:opacity-100 transition-all">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-5 rounded-2xl border-2 border-dashed border-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] font-bold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
            Load More Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
