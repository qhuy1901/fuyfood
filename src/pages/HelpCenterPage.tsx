import { useState } from 'react';
import TopNavBar from '../components/shared/TopNavBar';
import BottomNavBar from '../components/shared/BottomNavBar';

const HELP_CATEGORIES = [
  { id: 'orders', title: 'Orders & Tracking', desc: 'Track live orders and history', icon: 'receipt_long' },
  { id: 'payments', title: 'Payments & Refunds', desc: 'Refund status and billing', icon: 'payments' },
  { id: 'account', title: 'Account & Profile', desc: 'Manage your data and privacy', icon: 'person' },
  { id: 'delivery', title: 'Delivery Issues', desc: 'Address and driver support', icon: 'local_shipping' },
  { id: 'promotions', title: 'Promotions', desc: 'Vouchers and referral codes', icon: 'redeem' },
  { id: 'tech', title: 'Technical Support', desc: 'App and website glitches', icon: 'bug_report' },
];

const FAQS = [
  {
    q: 'Where is my order?',
    a: 'You can track your order in real-time from the "Orders" tab. If the driver is delayed beyond the estimated time, you can contact them directly through the app call feature.'
  },
  {
    q: 'How do I request a refund?',
    a: 'Refunds can be requested within 24 hours of delivery for items that were missing, damaged, or incorrect. Go to your Order Details and select \'Report a Problem\'.'
  },
  {
    q: 'Can I change my delivery address?',
    a: 'Once an order is confirmed, address changes depend on the distance. Contact support immediately through live chat to see if a change is possible.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit/debit cards, digital wallets like Apple Pay and Google Pay, and FuyFood Wallet credits.'
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <TopNavBar />

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 pb-32">
        {/* Hero Section */}
        <section className="text-center mb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Help Center</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg mb-8">How can we help you today?</p>
          <div className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search for articles, orders, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-[var(--color-surface-container-lowest)] rounded-3xl shadow-[0_12px_40px_rgba(27,28,28,0.08)] border-2 border-transparent focus:border-[var(--color-primary)]/20 transition-all focus:outline-none text-[var(--color-on-surface)]"
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Categories and Specific Order */}
          <div className="lg:col-span-8 space-y-12">
            {/* Categories Grid */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HELP_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className="flex items-start gap-4 p-6 bg-[var(--color-surface-container-lowest)] rounded-3xl hover:bg-[var(--color-surface-container-low)] transition-all hover:scale-[1.02] active:scale-[0.98] text-left group shadow-sm border border-neutral-50"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-container)]/10 text-[var(--color-primary)] flex items-center justify-center filter group-hover:brightness-110 transition-all">
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>{cat.title}</h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-black mb-8" style={{ fontFamily: 'var(--font-headline)' }}>Popular FAQs</h2>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden border border-neutral-50 shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-surface-container-low)] transition-colors"
                    >
                      <span className="font-bold text-lg pr-4" style={{ fontFamily: 'var(--font-headline)' }}>{faq.q}</span>
                      <span className={`material-symbols-outlined transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180 text-[var(--color-primary)]' : 'text-neutral-400'}`}>
                        expand_more
                      </span>
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${expandedFaq === idx ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="px-6 pb-6 text-neutral-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Support Options */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--color-surface-container-highest)] rounded-[3rem] p-10 text-center shadow-sm border border-neutral-100/50">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 transform -rotate-6 group hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)] fill-icon">support_agent</span>
                </div>
                <h2 className="text-2xl font-black mb-4" style={{ fontFamily: 'var(--font-headline)' }}>Still need help?</h2>
                <p className="text-[var(--color-on-surface-variant)] text-sm mb-8 leading-relaxed">Send us a detailed report and we'll get back to you in under 30 minutes.</p>

                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">chat</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Live Chat</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Speak with agents</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-neutral-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </button>

                  <a href="mailto:huytq67@fuyfood.com" className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">mail</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Email Support</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">huytq67@fuyfood.com</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-neutral-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </a>

                  <a href="tel:+84365990290" className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">phone</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Hotline</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">+84 365 990 290</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-neutral-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </a>
                </div>
              </div>

              {/* Tips Badge */}
              <div className="bg-[var(--color-tertiary-fixed)] rounded-3xl p-6 flex items-center gap-4 shadow-sm border border-[var(--color-tertiary)]/10">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] text-3xl">lightbulb</span>
                <div>
                  <p className="text-xs font-black text-[var(--color-tertiary)] uppercase tracking-wider mb-1">Support Tip</p>
                  <p className="text-sm font-semibold text-[var(--color-on-tertiary-fixed)]">Attaching photos of the issue helps us resolve it faster!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
