import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { addresses, paymentMethods, cartItems } from '../data/mockData';
import { useCheckout } from '../hooks/useCheckout';

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

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
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
                <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>Delivery Instructions</h2>
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
                  <span>Subtotal ({cartItems.length} items)</span>
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
      </main>

      <BottomNavBar />
    </div>
  );
}
