import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { orderHistory as mockHistory } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface HistoryItem {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
  status: string;
  itemsSummary: string;
  imageUrl: string;
}

const statusStyle: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Active: 'bg-blue-100 text-blue-700',
};

const reorderFavorites = [
  { name: "Mama's Italian Pizza", count: 5, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA05xG3hutIYspi7ci1YHVSpo0f78wpj85_xh8XreZXk5oaNR1yO6pKGcX73Q9CnUNjvyj2lr6Be330IvdGhoD0nr_KNP9v-7qJMnULW6PF1IS8zPwGY_P-zNgqsSRZAfh7aJGAo5OlhPb35OSZLlaKMjrZNx9WJ7iN7xYjhmtOGZPYkFNHh4E1_T_2lFXiuYY0udC92hqDs9auTRqDZF7QBqhlpA-2jwLrr9kVk4GsH2buN7zCCdFypiTYi4l1rdfAjcSHPL7vXWtj' },
  { name: 'The Burger Collective', count: 3, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu4A9klcj2pWTBFlaFfzKU9WOrg2NORBFypnyflXspA93KTGJ5MQkIApVBnxZuvm3qNk8hwBH7XFPg-4xd4jyTNzDy5hPzQs_fXas8dbV7V4Ug6cdxN6PYTLiFWySyrW7TeyDCC3BXvDAHJ4TMz9Oc5mJLnz8baKtLbBpbDg1jszPYabENvNkvKw0OG75QTSSE1LnIkC9wssaS0uiZ7x7e0X8bOoUTavpFDzc8DxejfQ_ITOpoMvtD6NTxG1XQwijHWdBLAgERZM08' },
];

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted: HistoryItem[] = (orders || []).map(order => {
          const items = order.order_items || [];
          const summary = items.map((i: any) => `${i.quantity}x ${i.item_name}`).join(', ');
          const date = new Date(order.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return {
            id: order.id,
            restaurantName: 'Urban Umami', // Default for now as restaurant info isn't in orders table yet
            date,
            total: Number(order.total_amount),
            status: order.status === 'Pending' ? 'Active' : order.status,
            itemsSummary: summary || 'No items listed',
            imageUrl: items[0]?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
          };
        });

        setHistory(formatted.length > 0 ? formatted : mockHistory as any);
      } catch (err) {
        console.error('Error fetching history:', err);
        setHistory(mockHistory as any);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar />

      <main className="max-w-screen-xl mx-auto px-6 py-8 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            {/* <nav className="flex items-center gap-2 text-[var(--color-on-surface-variant)] text-sm mb-2">
              <span>Account</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[var(--color-primary)] font-semibold">Order History</span>
            </nav> */}
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Your past cravings</h1>
            <p className="text-[var(--color-on-surface-variant)] mt-2">Everything you've enjoyed from FuyFood, in one place.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-semibold text-sm hover:scale-[1.02] transition-transform">All Orders</button>
            <button className="px-6 py-2.5 rounded-full bg-white text-[var(--color-on-surface-variant)] font-medium text-sm hover:bg-[var(--color-surface-container-low)] transition-colors">Re-order Quick Link</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Feed */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2].map(n => (
                  <div key={n} className="h-48 rounded-2xl bg-[var(--color-surface-container-low)] animate-pulse" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-12 text-center">
                <p className="text-[var(--color-on-surface-variant)]">No orders yet. Time to start feasting!</p>
              </div>
            ) : (
              history.map(order => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)] group hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img alt={order.restaurantName} src={order.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>{order.restaurantName}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${statusStyle[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                          </div>
                          <p className="text-[var(--color-on-surface-variant)] text-sm font-medium mb-3">{order.date}</p>
                        </div>
                        <p className="text-xl font-extrabold">${order.total.toFixed(2)}</p>
                      </div>
                      <p className="text-[var(--color-on-surface-variant)] text-sm line-clamp-1 mb-6">{order.itemsSummary}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-surface-container-high)]">
                        <button className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline">
                          <span className="material-symbols-outlined text-sm">receipt</span>
                          View Details
                        </button>
                        <button
                          className="text-[var(--color-on-primary)] px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))' }}
                        >
                          <span className="material-symbols-outlined text-base">refresh</span>
                          Re-order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Re-order favorites */}
            <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Re-order Favorites</h4>
              <div className="space-y-4">
                {reorderFavorites.map(fav => (
                  <div key={fav.name} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img alt={fav.name} src={fav.img} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm truncate">{fav.name}</p>
                      <p className="text-[var(--color-on-surface-variant)] text-xs">Ordered {fav.count} times</p>
                    </div>
                    <button className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Orders', value: '24', color: 'text-[var(--color-primary)]' }, { label: 'Spent', value: '$542', color: 'text-[var(--color-on-surface)]' }].map(s => (
                <div key={s.label} className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-surface-container-high)]">
                  <p className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Pro card */}
            <div className="relative bg-[var(--color-tertiary-container)] text-white rounded-2xl p-6 overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2">Join Pro</h4>
                <p className="text-sm opacity-90 mb-4">Unlimited free delivery on all orders over $20.</p>
                <button className="bg-white text-[var(--color-tertiary-container)] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-surface)] transition-colors">
                  Upgrade Now
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-20 rotate-12">star</span>
            </div>
          </aside>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
