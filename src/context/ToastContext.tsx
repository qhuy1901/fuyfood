import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'warning' | 'info' | 'error';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  emoji?: string;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, emoji?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success', emoji?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, variant, emoji }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  const variantStyles: Record<ToastVariant, string> = {
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
    info:    'bg-sky-600 text-white',
    error:   'bg-red-600 text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl text-sm font-bold
              ${variantStyles[toast.variant]}
              animate-[slideInRight_0.3s_ease-out]`}
          >
            {toast.emoji && <span className="text-base">{toast.emoji}</span>}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
