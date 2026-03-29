import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (restaurantId: string) => Promise<void>;
  isInWishlist: (restaurantId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist')
      .select('restaurant_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setWishlist(data.map(item => item.restaurant_id));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (restaurantId: string) => {
    if (!user) return;

    const isCurrent = wishlist.includes(restaurantId);

    if (isCurrent) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId);

      if (!error) {
        setWishlist(prev => prev.filter(id => id !== restaurantId));
      } else {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist')
        .insert([{ user_id: user.id, restaurant_id: restaurantId }]);

      if (!error) {
        setWishlist(prev => [...prev, restaurantId]);
      } else {
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  const isInWishlist = (restaurantId: string) => wishlist.includes(restaurantId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
