import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { calculateDynamicStatus, type OrderStatus } from '../utils/orderStatus';
import RateRestaurantModal from '../components/RateRestaurantModal';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  discount: number;
  delivery_address: string;
  notes: string;
  payment_method: string;
  created_at: string;
  delivered_at?: string;
}

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Order Placed');
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  const handleReorder = () => {
    if (!order) return;
    clearCart();
    items.forEach(item => {
      addItem({
        productId: item.id || 'r-item',
        restaurantId: 'r2', // Urban Umami
        restaurantName: 'Urban Umami',
        name: item.item_name,
        image: item.image_url,
        basePrice: item.unit_price,
        quantity: item.quantity
      });
    });
    navigate('/cart');
  };

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (orderErr) throw orderErr;
        setOrder(orderData);

        if (orderData) {
          setCurrentStatus(calculateDynamicStatus(orderData));
        }

        const { data: itemsData, error: itemsErr } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);

        if (itemsErr) throw itemsErr;
        setItems(itemsData || []);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id]);

  // Periodic status refresh
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      const newStatus = calculateDynamicStatus(order);
      if (newStatus !== currentStatus) {
        setCurrentStatus(newStatus);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order, currentStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-outline)] mb-4" style={{ fontSize: '4rem' }}>error</span>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-[var(--color-on-surface-variant)] mb-6">We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/orders')} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold">Back to Orders</button>
      </div>
    );
  }

  const dateStr = new Date(order.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isTrackingAvailable = ['Order Placed', 'Confirmed', 'Delivering'].includes(currentStatus);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar simplified pageTitle="Order Details" />

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Summary & Items */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Restaurant Info Header */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-container-highest)] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                    <img
                      alt="Store logo"
                      className="w-full h-full object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT75FQXP50q1yj9aOXL2-Eea3YBlLeQpdASRg&s"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-headline)' }}>Urban Umami</h1>
                    <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)] text-sm">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>123 Gourmet Lane, Food District</span>
                    </div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs mt-1 font-medium opacity-70 italic">Order #{order.id.slice(0, 8).toUpperCase()} • {dateStr}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${currentStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                      currentStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {currentStatus}
                  </span>
                  {isTrackingAvailable && (
                    <Link
                      to={`/order/${order.id}/tracking`}
                      className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold transition-transform active:scale-95 shadow-md shadow-[var(--color-primary)]/20"
                    >
                      <span className="material-symbols-outlined text-sm">route</span>
                      Track Live
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Items List */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'var(--font-headline)' }}>
                <span className="w-8 h-8 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] flex items-center justify-center text-sm">
                  {items.length}
                </span>
                Order Items
              </h2>
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={item.id} className={`flex gap-6 pb-6 ${idx < items.length - 1 ? 'border-b border-[var(--color-surface-container)]' : ''}`}>
                    <div className="relative">
                      <img src={item.image_url} alt={item.item_name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
                      <div className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow py-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg leading-tight">{item.item_name}</h4>
                        <span className="font-black text-[var(--color-on-surface)] text-lg">${(item.unit_price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">Standard preparation • Chef's recommendation</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Delivery & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[var(--color-primary)]">location_on</span>
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Delivery Address</h2>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-surface-container-low)] border border-[var(--color-surface-container)]">
                  <p className="text-sm font-bold text-[var(--color-primary)] mb-1">Home</p>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{order.delivery_address}</p>
                </div>
              </section>

              <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[var(--color-primary)]">sticky_note_2</span>
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Order Note</h2>
                </div>
                {order.notes ? (
                  <div className="p-4 rounded-2xl bg-[var(--color-primary-container)]/10 border border-[var(--color-primary-container)]/20">
                    <p className="text-sm italic text-[var(--color-on-surface)] leading-relaxed font-medium">"{order.notes}"</p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-on-surface-variant)] italic">No instructions provided.</p>
                )}
              </section>
            </div>
          </div>

          {/* Right Column: Payment & Help */}
          <div className="lg:col-span-4 space-y-6">
            {/* 4. Payment Summary */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-container)]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <h2 className="text-xl font-bold mb-8 underline decoration-[var(--color-primary)] decoration-4 underline-offset-8" style={{ fontFamily: 'var(--font-headline)' }}>Payment Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-[var(--color-on-surface-variant)]">Subtotal</span>
                  <span className="font-bold text-base">${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-[var(--color-on-surface-variant)]">Delivery Fee</span>
                  <span className="font-bold text-base text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-[var(--color-on-surface-variant)]">Service Fee</span>
                  <span className="font-bold text-base">${Number(order.service_fee).toFixed(2)}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-base text-green-600 font-black pt-2">
                    <span>Voucher Discount</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t-2 border-dashed border-[var(--color-surface-container-high)] flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Total Paid</span>
                <span className="text-3xl font-black text-[var(--color-primary)]">${Number(order.total_amount).toFixed(2)}</span>
              </div>

              {/* 5. Payment Method Details */}
              <div className="mb-8 p-4 rounded-2xl bg-[var(--color-surface-container-low)] border border-[var(--color-surface-container)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Payment Method</h4>
                  <span className="material-symbols-outlined text-sm text-green-600">verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">payments</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{order.payment_method || 'Encrypted Card'}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-black">Transaction ID: {order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReorder}
                className="w-full py-4 rounded-2x border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black transition-all hover:bg-[var(--color-primary)] hover:text-white active:scale-95 flex items-center justify-center gap-2 mb-4 rounded-2xl"
              >
                <span className="material-symbols-outlined">refresh</span>
                Re-order this Meal
              </button>

              {currentStatus === 'Delivered' && (
                <button
                  onClick={() => setIsRateModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 flex items-center justify-center gap-2 mb-4"
                >
                  <span className="material-symbols-outlined">star</span>
                  Rate Restaurant
                </button>
              )}
            </section>

            {/* 6. Need Help Button */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)] border border-[var(--color-surface-container-low)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-container)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">help</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">Need Help?</h4>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Chat with our support about this order</p>
                </div>
                <button className="p-2.5 rounded-xl bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] transition-all active:scale-90">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <RateRestaurantModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        restaurantName="Urban Umami"
        restaurantImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT75FQXP50q1yj9aOXL2-Eea3YBlLeQpdASRg&s"
      />
    </div>
  );
}
