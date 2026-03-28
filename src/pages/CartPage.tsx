import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, updateQty, removeItem, clearCart } = useCart();
  const items = state.items;
  const [note, setNote] = useState('');

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    const item = items.find(item => item.cartItemId === cartItemId);
    if (!item) return;
    updateQty(cartItemId, item.quantity + delta);
  };

  const removeItemById = (cartItemId: string) => removeItem(cartItemId);

  const subtotal = items.reduce((s, i) => s + i.basePrice * i.quantity, 0);
  const deliveryFee = 2.0;
  const serviceFee = 1.5;
  const total = subtotal + deliveryFee + serviceFee;
  const itemCount = state.totalItems;

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar
        simplified
        pageTitle="Cart"
        hideCartLink
        actionButton={{ label: 'CLEAR CART', icon: 'delete', onClick: clearCart }}
      />

      <main className="pt-24 pb-40 px-4 max-w-screen-xl mx-auto">
        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <span className="material-symbols-outlined text-8xl text-[var(--color-surface-container-highest)]">
              shopping_bag
            </span>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Your cart is empty</h2>
            <p className="text-[var(--color-on-surface-variant)]">Add some delicious items!</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-full text-white font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container)', fontFamily: 'var(--font-headline)' }}
            >
              Browse Restaurants
            </button>
          </div>
        )}

        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Restaurant + Items */}
              <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
                {/* Store header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      alt="Store logo"
                      className="w-full h-full object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT75FQXP50q1yj9aOXL2-Eea3YBlLeQpdASRg&s"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Urban Umami</h2>
                    <p className="text-[var(--color-on-surface-variant)] text-sm">Japanese Fusion • Ramen • Sushi • 1.2 km</p>
                  </div>
                </div>

                {/* Item list */}
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.cartItemId}
                      className={`flex gap-4 py-4 ${idx < items.length - 1 ? 'border-b border-[var(--color-surface-container-low)]' : ''}`}
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img alt={item.name} src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>{item.name}</h3>
                            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{item.restaurantName}</p>
                          </div>
                          <span className="font-bold text-lg ml-4 flex-shrink-0" style={{ fontFamily: 'var(--font-headline)' }}>
                            ${(item.totalPrice).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          {/* Qty stepper */}
                          <div className="flex items-center bg-[var(--color-surface-container-low)] rounded-full p-1 gap-4">
                            <button
                              onClick={() => handleUpdateQty(item.cartItemId, -1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item.cartItemId, 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                          {/* Delete */}
                          <button
                            onClick={() => removeItemById(item.cartItemId)}
                            className="text-[var(--color-on-surface-variant)]/40 hover:text-[var(--color-error)] transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Notes */}
              <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">notes</span>
                  <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>
                    Add note for restaurant or driver
                  </h2>
                </div>
                <textarea
                  className="w-full bg-[var(--color-surface-container-low)] border-none rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)] min-h-[100px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 text-sm resize-none"
                  placeholder="E.g. Please leave at the front door or no onions please..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Sticky order summary */}
              <section className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[0_12px_32px_rgba(27,28,28,0.06)] lg:sticky lg:top-24">
                <h2 className="font-bold text-lg mb-6" style={{ fontFamily: 'var(--font-headline)' }}>Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[var(--color-on-surface-variant)] text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--color-on-surface-variant)] text-sm">
                    <span>Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--color-on-surface-variant)] text-sm">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-[var(--color-surface-container)]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-extrabold text-xl" style={{ fontFamily: 'var(--font-headline)' }}>Total Amount</span>
                    <span className="font-extrabold text-2xl text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-headline)' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-5 text-white font-black text-lg rounded-2xl shadow-[0_8px_20px_rgba(178,34,4,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                      fontFamily: 'var(--font-headline)',
                    }}
                  >
                    PROCEED TO CHECKOUT
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <p className="text-[10px] text-center text-[var(--color-on-surface-variant)] mt-4 px-4 leading-tight uppercase tracking-widest font-bold">
                    Prices include tax and fees where applicable
                  </p>
                </div>
              </section>

              {/* Delivery info badge */}
              <div className="p-4 bg-[var(--color-tertiary-fixed)] rounded-2xl flex items-center gap-4 shadow-sm">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] fill-icon">schedule</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-tertiary)] uppercase tracking-wider">Estimated Delivery</p>
                  <p className="font-extrabold text-[var(--color-on-tertiary-fixed)]" style={{ fontFamily: 'var(--font-headline)' }}>
                    25 - 35 mins
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile bottom checkout bar */}
      {!isEmpty && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full p-6 bg-white rounded-t-[2rem] shadow-[0_-12px_32px_rgba(27,28,28,0.1)] z-50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-on-surface-variant)] font-bold uppercase tracking-wider">Total</span>
              <span className="font-black text-2xl text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-headline)' }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <span className="text-xs text-[var(--color-on-surface-variant)]">{itemCount} Items</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full text-white py-5 rounded-full font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
              fontFamily: 'var(--font-headline)',
            }}
          >
            PROCEED TO CHECKOUT
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
