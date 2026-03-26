import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id/tracking" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
