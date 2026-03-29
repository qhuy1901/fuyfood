import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/shared/ScrollToTop';
import HomePage from './pages/HomePage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import RestaurantListPage from './pages/RestaurantListPage';
import CartPage from './pages/CartPage';
import NearbyRestaurantsPage from './pages/NearbyRestaurantsPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import LoginModal from './components/shared/LoginModal';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/order/:id/tracking" element={<OrderTrackingPage />} />
        <Route path="/tracking/:id" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/restaurants" element={<RestaurantListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/nearby" element={<NearbyRestaurantsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </BrowserRouter>
  );
}
