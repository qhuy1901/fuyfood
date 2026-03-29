import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
)
