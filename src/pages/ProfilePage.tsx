import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { orderHistory as mockHistory, vouchers, addresses as mockAddresses, type Address, type OrderHistoryItem } from '../data/mockData';
import { calculateDynamicStatus } from '../utils/orderStatus';

interface ProfileOrder extends OrderHistoryItem {
  restaurantId: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formatted = (data || []).map((order: any) => {
          const items = order.order_items || [];
          const status = calculateDynamicStatus({
            created_at: order.created_at,
            delivered_at: order.delivered_at,
            status: order.status
          });

          return {
            id: order.id,
            restaurantName: 'Urban Umami', // Fallback for demo
            restaurantId: 'r2',
            date: new Date(order.created_at).toLocaleDateString(),
            total: Number(order.total_amount),
            status,
            itemsSummary: items.map((i: any) => i.item_name).join(', '),
            imageUrl: items[0]?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
          };
        });

        setOrders(formatted.length > 0 ? formatted as any : mockHistory as any);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders(mockHistory as any);
      } finally {
        // No loading state to reset
      }
    }
    fetchOrders();
  }, [user]);

  const ongoingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled').slice(0, 3);

  const handleEditAddress = (id: string, currentVal: string) => {
    setEditingAddressId(id);
    setEditValue(currentVal);
  };

  const saveAddress = (id: string) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, line1: editValue } : a));
    setEditingAddressId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)]">
        <TopNavBar />
        <main className="max-w-screen-md mx-auto px-6 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4" style={{ fontSize: '4rem' }}>account_circle</span>
          <h1 className="text-2xl font-black mb-2">Please sign in</h1>
          <p className="text-neutral-500 mb-8">You need to be logged in to view your profile.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full font-bold"
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
        {/* User Header */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 flex flex-col md:flex-row items-center gap-6 border border-neutral-50">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-50 shadow-inner">
            <img
              src={user.user_metadata.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s96-c'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
              {user.user_metadata.full_name || 'Foodie Explorer'}
            </h1>
            <p className="text-neutral-400 font-medium mt-1">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Gold Elite</span>
            </div>
          </div>
          <button
            onClick={async () => {
              setIsSigningOut(true);
              try {
                await signOut();
                navigate('/');
              } catch (error) {
                console.error('Sign out failed:', error);
              } finally {
                setIsSigningOut(false);
              }
            }}
            disabled={isSigningOut}
            className="px-6 py-2.5 rounded-full border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-8">

            {/* Ongoing Orders */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Ongoing Orders</h2>
                {ongoingOrders.length > 0 && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>}
              </div>

              {ongoingOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-neutral-200">
                  <p className="text-neutral-400 text-sm">No ongoing deliveries right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ongoingOrders.map(order => (
                    <Link
                      key={order.id}
                      to={`/order/${order.id}/tracking`}
                      className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-orange-50 flex-shrink-0">
                          <img src={order.imageUrl} alt={order.restaurantName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-bold text-sm truncate">{order.restaurantName}</h3>
                          <p className="text-xs text-[var(--color-primary)] font-black mt-0.5">{order.status}</p>
                          <div className="w-full bg-neutral-50 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-[var(--color-primary)] h-full w-2/3 animate-pulse" />
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-neutral-300 group-hover:text-[var(--color-primary)]">chevron_right</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* My Addresses */}
            <section>
              <h2 className="text-xl font-black tracking-tight mb-4" style={{ fontFamily: 'var(--font-headline)' }}>My Addresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm relative group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[var(--color-primary)]">
                        <span className="material-symbols-outlined">{addr.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-400">{addr.label}</h3>
                          <button
                            onClick={() => editingAddressId === addr.id ? saveAddress(addr.id) : handleEditAddress(addr.id, addr.line1)}
                            className="text-[var(--color-primary)] text-xs font-bold hover:underline"
                          >
                            {editingAddressId === addr.id ? 'Save' : 'Edit'}
                          </button>
                        </div>
                        {editingAddressId === addr.id ? (
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-sm font-medium border-b-2 border-orange-200 outline-none pb-1"
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm font-bold text-neutral-700 leading-relaxed">{addr.line1}</p>
                        )}
                        <p className="text-[11px] text-neutral-400 mt-1">{addr.line2}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-3xl p-6 flex items-center justify-center gap-2 text-neutral-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all group">
                  <span className="material-symbols-outlined">add_location</span>
                  <span className="font-bold text-sm">Add New Address</span>
                </button>
              </div>
            </section>

            {/* Recent Orders History */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>Recent Cravings</h2>
                <Link to="/orders" className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All</Link>
              </div>
              <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm">
                {pastOrders.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-sm">No past orders yet.</div>
                ) : (
                  <div className="divide-y divide-neutral-50">
                    {pastOrders.map(order => (
                      <div key={order.id} className="p-5 flex items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={order.imageUrl} alt={order.restaurantName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-bold text-base truncate">{order.restaurantName}</h3>
                            <span className="font-black text-sm">${order.total.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mb-2">{order.date} • {order.itemsSummary}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-green-50 text-green-600 uppercase tracking-widest">{order.status}</span>
                            <button
                              onClick={() => navigate(`/order/${order.id}`)}
                              className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest hover:underline"
                            >
                              Re-order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">

            {/* Vouchers */}
            <section>
              <h2 className="text-xl font-black tracking-tight mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Available Vouchers</h2>
              <div className="space-y-4">
                {vouchers.map(v => (
                  <div key={v.id} className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">{v.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-neutral-800">{v.label}</p>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">MIN SPEND ${v.minSpend}</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mb-4">{v.subtext}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                        <code className="bg-neutral-50 px-3 py-1 rounded-lg text-xs font-black text-[var(--color-primary)] tracking-widest">{v.code}</code>
                        <span className="text-[10px] font-bold text-neutral-400">Valid until {v.validUntil}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* App Settings */}
            <section className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
              <h2 className="text-lg font-black tracking-tight mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Preferences</h2>
              <div className="space-y-1">
                {[
                  { icon: 'notifications', label: 'Notifications', value: 'Enabled' },
                  { icon: 'language', label: 'Language', value: 'English' },
                  { icon: 'dark_mode', label: 'Appearance', value: 'Light' },
                  { icon: 'help', label: 'Help & Support' }
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors group">
                    <span className="material-symbols-outlined text-neutral-400 group-hover:text-[var(--color-primary)] transition-colors">{item.icon}</span>
                    <span className="flex-grow text-left text-sm font-bold text-neutral-700">{item.label}</span>
                    {item.value && <span className="text-xs font-black text-neutral-300 uppercase tracking-widest">{item.value}</span>}
                    <span className="material-symbols-outlined text-neutral-200 text-sm">chevron_right</span>
                  </button>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
