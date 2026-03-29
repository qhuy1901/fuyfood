import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { trackingSteps as mockSteps } from '../data/mockData';
import { supabase } from '../lib/supabase';

import { calculateDynamicStatus, formatStepTime, type OrderStatus } from '../utils/orderStatus';

interface Order {
  id: string;
  status: string;
  total_amount: number;
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

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('Order Placed');

  useEffect(() => {
    async function fetchOrderData() {
      if (!id) {
        setLoading(false);
        return;
      }
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
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderData();
  }, [id]);

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
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-outline)] mb-4">error</span>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-[var(--color-on-surface-variant)] mb-6">We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/orders')} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold">Back to Orders</button>
      </div>
    );
  }

  // Map dynamic status to tracking steps
  const steps = mockSteps.map((step, idx) => {
    let status: 'done' | 'active' | 'pending' = 'pending';
    
    const statusMap: Record<string, number> = {
      'Order Placed': 0,
      'Confirmed': 1,
      'Preparing': 2,
      'Delivering': 3,
      'Delivered': 4
    };

    const currentIdx = statusMap[currentStatus] ?? 0;

    if (idx < currentIdx) {
      status = 'done';
    } else if (idx === currentIdx) {
      status = 'active';
    } else if (currentStatus === 'Delivered') {
      status = 'done';
    }
    
    return { 
      ...step, 
      status,
      time: order ? formatStepTime(step.label, order.created_at, status !== 'pending', order.delivered_at) : step.time
    };
  });

  const displayId = order.id.slice(0, 8).toUpperCase();
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavBar />

      <main className="max-w-screen-2xl mx-auto px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Status */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-[0_12px_32px_rgba(27,28,28,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full" style={{ background: 'linear-gradient(135deg, #b22204, #d63c1e)' }} />
            <h1 className="font-extrabold text-3xl tracking-tight mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              {currentStatus === 'Order Placed' ? 'Order Received' : 
               currentStatus === 'Confirmed' ? 'Kitchen is preparing' :
               currentStatus === 'Delivering' ? 'Out for delivery' : 'Enjoy your meal!'}
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-sm mb-8 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentStatus === 'Delivered' ? 'bg-green-500' : 'bg-[var(--color-primary)] animate-pulse'}`} />
              Order #{displayId} from <span className="font-bold text-[var(--color-on-surface)] ml-1">Urban Umami</span>
            </p>

            {/* Stepper */}
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-surface-container-high)]">
              {steps.map(step => (
                <div key={step.label} className="relative flex items-center gap-4">
                  {step.status === 'done' && (
                    <div className="z-10 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-white fill-icon">check</span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="z-10 w-6 h-6 rounded-full bg-white border-4 border-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="z-10 w-6 h-6 rounded-full bg-[var(--color-surface-container-high)] flex-shrink-0" />
                  )}
                  <div className={`flex-1 ${step.status === 'pending' ? 'opacity-50' : ''}`}>
                    <h3 className={`font-bold text-sm ${step.status === 'active' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`} style={{ fontFamily: 'var(--font-headline)' }}>
                      {step.label}
                    </h3>
                    <p className="text-[var(--color-on-surface-variant)] text-xs">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Items */}
          <section className="bg-[var(--color-surface-container-low)] p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>Order Items</h2>
              <span
                onClick={() => navigate(`/order/${id}`)}
                className="text-[var(--color-primary)] font-bold text-sm cursor-pointer hover:underline"
              >
                View Receipt
              </span>
            </div>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img alt={item.item_name} src={item.image_url} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.quantity}x {item.item_name}</h4>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Default Options</p>
                  </div>
                  <span className="font-bold text-sm">${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--color-outline-variant)]/20 flex justify-between">
              <span className="text-[var(--color-on-surface-variant)] font-medium">Total (Incl. delivery)</span>
              <span className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>${order.total_amount.toFixed(2)}</span>
            </div>
          </section>
        </div>

        {/* Right: Map + Driver */}
        <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
          {/* Mock Map */}
          <section className="flex-1 min-h-[500px] bg-[var(--color-surface-container)] rounded-2xl relative overflow-hidden border border-[var(--color-outline-variant)]/10 shadow-sm">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* Road lines */}
            <div className="absolute top-1/4 left-1/4 w-32 h-1 bg-[var(--color-surface-container-highest)] rotate-[30deg] rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-48 h-1 bg-[var(--color-surface-container-highest)] -rotate-[15deg] rounded-full" />
            <div className="absolute top-2/3 right-1/4 w-40 h-1 bg-[var(--color-surface-container-highest)] rotate-[45deg] rounded-full" />

            {/* Driver marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--color-primary)]/20 animate-ping rounded-full" />
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white" style={{ background: 'linear-gradient(135deg, #b22204, #d63c1e)' }}>
                  <span className="material-symbols-outlined fill-icon">pedal_bike</span>
                </div>
              </div>
              <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-[var(--color-outline-variant)]/20">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-[var(--color-primary)]">Heading to Restaurant</span>
              </div>
            </div>

            {/* Home marker */}
            <div className="absolute top-1/4 right-1/4 flex flex-col items-center">
              <div className="w-8 h-8 bg-[var(--color-on-surface)] rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-sm fill-icon">home</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              {['add', 'remove', 'my_location'].map(icon => (
                <button key={icon} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-neutral-50 transition-colors">
                  <span className={`material-symbols-outlined text-[var(--color-on-surface)] ${icon === 'my_location' ? 'text-[var(--color-primary)] fill-icon' : ''}`}>{icon}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Driver card */}
          <section className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  alt="Driver"
                  className="w-14 h-14 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBxX8ixnVbd0pmFkXqRAJ_-GOzy_WukSqhj-PPksXycuoPyYzhPcwoDBE_k9Gi0TlguoR02apAW5Hr0JK6cEZ-RMhk1mn44O2w4XFDjcQ3od0Ex9_ErKkoZyJjdzw5eT-yVToWOF1Hc9prkOKkLDH-r6VjX-6bbx1uLv2QKkof1ZKGIRfv-Yv9XInpiymTIDZRgRvlCyQsCvVftM1nVUrl6RHEa0N7SUupdKfSnX0CZU0AU81kK6bYsfCc36AAaHZx5ZbjIRHVx7gX"
                />
                <div className="absolute -bottom-1 -right-1 bg-[var(--color-tertiary)] w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  4.9
                </div>
              </div>
              <div>
                <h4 className="font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-headline)' }}>Marco Santini</h4>
                <p className="text-xs text-[var(--color-on-surface-variant)]">White Honda Super Cub • ABC-1234</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-surface-container-high)] rounded-full font-bold text-sm active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-lg fill-icon">chat</span>
                Message
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-white rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg, #b22204, #d63c1e)' }}>
                <span className="material-symbols-outlined text-lg fill-icon">call</span>
                Call Driver
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNavBar />
      <div className="h-24 md:hidden" />
    </div>
  );
}
