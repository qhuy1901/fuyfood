import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { calculateDynamicStatus } from '../utils/orderStatus';

interface HistoryItem {
  id: string;
  restaurantName: string;
  restaurantId: string;
  date: string;
  total: number;
  status: string;
  itemsSummary: string;
  imageUrl: string;
  rawItems: any[];
}

const statusStyle: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Active: 'bg-blue-100 text-blue-700',
};


export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleReorder = (order: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't navigate to details
    clearCart();
    order.rawItems.forEach(item => {
      addItem({
        productId: item.id || 'r-item',
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName,
        name: item.item_name,
        image: item.image_url,
        basePrice: item.unit_price,
        quantity: item.quantity
      });
    });
    navigate('/cart');
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted: HistoryItem[] = (orders || []).map((order: any) => {
          const items = order.order_items || [];
          const summary = items.map((i: any) => `${i.quantity}x ${i.item_name}`).join(', ');
          const date = new Date(order.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          const dynamicStatus = calculateDynamicStatus({
            created_at: order.created_at,
            delivered_at: order.delivered_at,
            status: order.status
          });

          return {
            id: order.id,
            restaurantName: 'Urban Umami',
            restaurantId: 'r2',
            date,
            total: Number(order.total_amount),
            status: dynamicStatus,
            itemsSummary: summary || 'No items listed',
            imageUrl: items[0]?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            rawItems: items
          };
        });

        setHistory(formatted);
      } catch (err) {
        console.error('Error fetching history:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)]">
        <TopNavBar />
        <main className="max-w-screen-md mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-neutral-300" style={{ fontSize: '4rem' }}>receipt_long</span>
          </div>
          <h1 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Sign in to see your orders</h1>
          <p className="text-neutral-500 mb-10 max-w-sm mx-auto font-medium">Keep track of your favorite meals and active deliveries by signing in to your account.</p>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold shadow-xl shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
          >
            Go to Home
          </button>
        </main>
        <BottomNavBar />
      </div>
    );
  }

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
              <div className="rounded-3xl border border-dashed border-[var(--color-surface-container-high)] bg-[var(--color-surface-container-lowest)] p-16 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-surface-container-low)] text-5xl">
                  <span>🥡</span>
                </div>
                <h2 className="text-2xl font-black mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                  Your orders is empty
                </h2>
                <p className="max-w-md mx-auto text-[var(--color-on-surface-variant)] mb-8 font-medium leading-relaxed">
                  You haven't ordered anything yet. Time to start feasting and discover the best flavors around you!
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 text-sm font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-200"
                >
                  <span className="material-symbols-outlined">explore</span>
                  Start Exploring
                </button>
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
                          onClick={(e) => handleReorder(order, e)}
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
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Orders', value: history.length.toString(), color: 'text-[var(--color-primary)]' },
                { label: 'Spent', value: `$${history.reduce((sum, o) => sum + o.total, 0).toFixed(0)}`, color: 'text-[var(--color-on-surface)]' }
              ].map(s => (
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
