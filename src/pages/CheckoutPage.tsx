import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { addresses, paymentMethods } from '../data/mockData';
import { useCheckout } from '../hooks/useCheckout';
import { useCart, type CartItem } from '../context/CartContext';

// ── Sub-component: STORE + ORDERED ITEMS ──────────────────────────────────────
function StoreOrderedItems({ items }: { items: CartItem[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasItems = items.length > 0;

  return (
    <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center overflow-hidden">
            <img
              alt="Store logo"
              className="w-full h-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT75FQXP50q1yj9aOXL2-Eea3YBlLeQpdASRg&s"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Urban Umami</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm">Japanese Fusion • Ramen • Sushi</p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-1 text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors"
        >
          {collapsed ? 'EXPAND' : 'COLLAPSE'}
          <span className="material-symbols-outlined text-lg">{collapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</span>
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-1">
          {hasItems ? (
            items.map((item, idx) => (
              <div
                key={item.cartItemId}
                className={`flex items-center gap-4 py-3 ${idx < items.length - 1 ? 'border-b border-[var(--color-surface-container-low)]' : ''}`}
              >
                <img alt={item.name} src={item.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold" style={{ fontFamily: 'var(--font-headline)' }}>{item.name}</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-xs mt-0.5">{item.restaurantName}</p>
                  <p className="text-[var(--color-on-surface-variant)] text-xs mt-1">{item.quantity}x</p>
                </div>
                <span className="font-bold flex-shrink-0" style={{ fontFamily: 'var(--font-headline)' }}>${item.totalPrice.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-[var(--color-on-surface-variant)]">Your cart is empty.</div>
          )}
        </div>
      )}
    </section>
  );
}

// ── Sub-component: CUSTOMERS ALSO ORDERED ─────────────────────────────────────
const upsellItems = [
  {
    id: 'u1',
    name: 'Classic Tiramisu',
    price: 8.50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9hQmvErCpGx1DJpBi4w6kMrm7ocxO-P_OJYW-yYAjWIZS1RkXMgDz_e93SdGAVqj5djwcq1I0qL0b98Slliq4tzmg58H0J2JkF6Pp3q_gO96YjxI12ghPw6xLcVEUS5PHlRmywloo0-iC2nqeYpJpSAuCgjObV-2E2P5IA_YYdsnk8kw2UppSJrrnnC03df2jzIbbtLwps2QuDhj8XlqxnpApSEcRb_6xh4y_2QZ-Al5Uiy1PEPu7DiQ6qAEXNqO8kFqysyojaVE-',
  },
  {
    id: 'u2',
    name: 'Cheesy Garlic Bread',
    price: 6.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkSVcaHUc4MamlVoHf0NSjH3FCobzL6y_46U_96vkLSnH3m_R1J54fb4kP2AexBYwiP33nXXPy6FTzT3xmjK7XMVOuBGrCv9Xaw0QrD20h7PD_Xa6USpP4YX_G7i-PQdnQL2kkt8jztt5gfU_MeHjTQ6uNiKKKYtzT9iX3trrgUfHWAxS6r6QcMmMmFwAZGaYbzeAiG-BK8rboYqTayRuN8Kuro0GNgPfGq4nWp6_PSAt7yXH7ZGYZMas-groCTcpVhFcyn-QXcqDt',
  },
  {
    id: 'u3',
    name: 'Berry Panna Cotta',
    price: 7.50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFYRsiuNB4Ws_kG0t9HGOyYSQxVJ_50yqXZUO0PYagO2AD8GFkJx1m1pBg2WBQ0obUScTtfbiKhdt77CCfA6ped5RBM_lcT6NqHJ7yYtcHXmIJxZYuQeIcA3RFa-hNe0x75MOodXOGkviQa0nfTRfM4KZUPNckNs7g_o1J4FRnb1d8pLZ2StsFSKkqUlJjB5a2uhU1vHbpkKySBsZdbfSQL1c0afH5CJFZlYsyHEtCuck3P7ItPUFG93cd0kGZWlSZcamH8uy_xt-2',
  },
  {
    id: 'u4',
    name: 'Roasted Veggies',
    price: 5.50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvfDwQuIQOoJL_g8ZVYjn_NqO2VnSz4K2HXn9fN0AFHpCtg_Y9A_M2OEyROb7yI3gXE6CA2-SlFO1YQCfRBvETkQz2N-cK_VleW_A_RnvRoPJZSbyc7pKRjFq_63v98aiZEAjpxQs2gUPyir7kjhYXodLnQuNNNLUfhWKleOvJGTkDR2XMomnlh2ZEJ9ziZqRipfvYUsrqjHTpPaoymdUMwemc_L_XvQa8mQDpCXRarZIk5F7Y39OkjDQk6fyufQ45JrgRGKnBAsek',
  },
];

function CustomersAlsoOrdered() {
  const [added, setAdded] = useState<Set<string>>(new Set());

  return (
    <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)] overflow-hidden">
      <h2 className="font-bold text-lg mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Customers also ordered</h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {upsellItems.map(item => (
          <div key={item.id} className="flex-none w-40 bg-[var(--color-surface-container-low)] rounded-xl overflow-hidden group">
            <div className="relative h-28">
              <img
                alt={item.name}
                src={item.imageUrl}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button
                onClick={() => setAdded(prev => new Set([...prev, item.id]))}
                className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${
                  added.has(item.id)
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{added.has(item.id) ? 'check' : 'add'}</span>
              </button>
            </div>
            <div className="p-3">
              <h4 className="font-bold text-sm truncate" style={{ fontFamily: 'var(--font-headline)' }}>{item.name}</h4>
              <p className="text-[var(--color-primary)] font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedAddressId, setAddress,
    selectedPaymentId, setPayment,
    voucherCode, setVoucherCode,
    voucherApplied, applyVoucher,
    deliveryNotes, setDeliveryNotes,
    isPlacingOrder, orderPlaced, placeOrder,
  } = useCheckout();

  const { state, clearCart } = useCart();

  useEffect(() => {
    if (orderPlaced) {
      clearCart();
    }
  }, [orderPlaced, clearCart]);

  const subtotal = state.totalPrice;
  const serviceFee = 1.20;
  const discount = voucherApplied ? 5.00 : 0;
  const total = subtotal + serviceFee - discount;

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <span className="material-symbols-outlined text-8xl text-[var(--color-primary)] fill-icon mb-6">check_circle</span>
        <h2 className="font-black text-3xl text-[var(--color-on-surface)] mb-2" style={{ fontFamily: 'var(--font-headline)' }}>Order Placed!</h2>
        <p className="text-[var(--color-on-surface-variant)] mb-8">Your feast is being prepared.</p>
        <button
          onClick={() => navigate('/order/FF-92841/tracking')}
          className="px-8 py-4 rounded-full font-black text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', fontFamily: 'var(--font-headline)' }}
        >
          Track My Order
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar simplified pageTitle="Checkout" />

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Address */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">location_on</span>
                  <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Delivery Address</h2>
                </div>
                <button className="text-[var(--color-primary)] font-bold text-sm px-4 py-2 hover:bg-[var(--color-primary-fixed)] rounded-full transition-all">EDIT</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setAddress(addr.id)}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-[var(--color-primary-fixed)] border-2 border-[var(--color-primary-container)]'
                        : 'bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-highest)] border-2 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined fill-icon ${selectedAddressId === addr.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>{addr.icon}</span>
                        <span className="font-bold" style={{ fontFamily: 'var(--font-headline)' }}>{addr.label}</span>
                      </div>
                      {selectedAddressId === addr.id && <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>}
                    </div>
                    <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">{addr.line1}<br />{addr.line2}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[var(--color-tertiary-fixed)] rounded-2xl flex items-center gap-4">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] fill-icon">schedule</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-tertiary)] uppercase tracking-wider">Estimated Arrival</p>
                  <p className="font-extrabold text-[var(--color-on-tertiary-fixed)]" style={{ fontFamily: 'var(--font-headline)' }}>25 – 35 mins (Fastest Delivery)</p>
                </div>
              </div>
            </section>

            {/* ── NEW: STORE + ORDERED ITEMS ── */}
            <StoreOrderedItems items={state.items} />

            {/* ── NEW: Customers also ordered ── */}
            <CustomersAlsoOrdered />

            {/* Payment Methods */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">payments</span>
                <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Payment Method</h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map(pm => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                      selectedPaymentId === pm.id ? 'border-[var(--color-primary-container)]' : 'border-transparent hover:border-[var(--color-primary-container)]'
                    } bg-[var(--color-surface-container-low)]`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPaymentId === pm.id ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-container-highest)]'}`}>
                        <span className={`material-symbols-outlined fill-icon ${selectedPaymentId === pm.id ? 'text-white' : 'text-[var(--color-on-surface-variant)]'}`}>{pm.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
                          {pm.name}
                          {pm.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] text-[10px] rounded-full uppercase">{pm.badge}</span>
                          )}
                        </p>
                        <p className="text-[var(--color-on-surface-variant)] text-xs">{pm.subtitle}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentId === pm.id}
                      onChange={() => setPayment(pm.id)}
                      className="w-5 h-5 text-[var(--color-primary)]"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* Delivery Notes */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">notes</span>
                <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>Note</h2>
              </div>
              <textarea
                className="w-full bg-[var(--color-surface-container-low)] border-none rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)] min-h-[100px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 resize-none"
                placeholder="e.g., 'No onions', 'Leave at the front gate', 'Gate code is 1234'..."
                value={deliveryNotes}
                onChange={e => setDeliveryNotes(e.target.value)}
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Voucher */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
              <h2 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Voucher Center</h2>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <span className="material-symbols-outlined text-orange-600 fill-icon">stars</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-orange-800">FuyFood Pro Perk</p>
                  <p className="text-xs text-orange-700">Free Delivery Applied</p>
                </div>
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <div className="relative mt-4">
                <input
                  className="w-full bg-[var(--color-surface-container-low)] border-none rounded-full py-3 px-5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]"
                  placeholder="Enter Promo Code"
                  value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value)}
                />
                <button
                  onClick={applyVoucher}
                  className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full hover:bg-[var(--color-primary-container)] transition-all"
                >
                  APPLY
                </button>
              </div>
            </section>

            {/* Order Summary */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)] sticky top-24">
              <h2 className="font-bold text-lg mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span>Subtotal ({state.totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span>Delivery Fee</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-xs">$4.00</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 font-medium">
                    <span>Voucher Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-[var(--color-surface-container)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Total</span>
                  <span className="font-extrabold text-2xl text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-headline)' }}>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-5 text-white font-black text-lg rounded-2xl shadow-[0_8px_20px_rgba(178,34,4,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                    fontFamily: 'var(--font-headline)',
                  }}
                >
                  {isPlacingOrder ? 'Placing Order...' : 'PLACE ORDER'}
                  {!isPlacingOrder && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
                <p className="text-[10px] text-center text-[var(--color-on-surface-variant)] mt-4 px-4 leading-tight uppercase tracking-widest font-bold">
                  By placing your order, you agree to our Terms of Service
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* ── NEW: Featured merchant bento ── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative h-48 rounded-2xl overflow-hidden group">
            <img
              alt="Urban Umami"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhgmW5TSvkqrgyyOaq0OXlENiPSnZrvAWDg&s"
            />
            <div className="absolute inset-0 flex items-end p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Ordering from</p>
                <h3 className="text-white font-bold text-2xl" style={{ fontFamily: 'var(--font-headline)' }}>Urban Umami</h3>
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-tertiary-fixed-dim)] rounded-2xl p-6 flex flex-col justify-center">
            <span className="material-symbols-outlined text-[var(--color-on-tertiary-fixed)] text-4xl mb-4 fill-icon">eco</span>
            <h4 className="font-bold text-[var(--color-on-tertiary-fixed)] text-xl leading-tight" style={{ fontFamily: 'var(--font-headline)' }}>Zero-Waste Delivery</h4>
            <p className="text-[var(--color-on-tertiary-fixed-variant)] text-sm mt-2">Packaged in 100% biodegradable materials. Good for you, better for the planet.</p>
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
