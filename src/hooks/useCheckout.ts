import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface OrderData {
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  discount: number;
  total_amount: number;
  delivery_address: string;
  notes: string;
  payment_method: string;
  items: Array<{
    item_name: string;
    quantity: number;
    unit_price: number;
    image_url: string;
  }>;
}

interface CheckoutState {
  selectedAddressId: string;
  selectedPaymentId: string;
  voucherCode: string;
  voucherApplied: boolean;
  deliveryNotes: string;
  isPlacingOrder: boolean;
  orderPlaced: boolean;
  orderId: string | null;
}

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    selectedAddressId: 'a1',
    selectedPaymentId: 'pm1',
    voucherCode: '',
    voucherApplied: false,
    deliveryNotes: '',
    isPlacingOrder: false,
    orderPlaced: false,
    orderId: null,
  });

  const setAddress = useCallback((id: string) => {
    setState(prev => ({ ...prev, selectedAddressId: id }));
  }, []);

  const setPayment = useCallback((id: string) => {
    setState(prev => ({ ...prev, selectedPaymentId: id }));
  }, []);

  const setVoucherCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, voucherCode: code }));
  }, []);

  const applyVoucher = useCallback(() => {
    setState(prev => ({ ...prev, voucherApplied: prev.voucherCode.length > 0 }));
  }, []);

  const setDeliveryNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, deliveryNotes: notes }));
  }, []);

  const placeOrder = useCallback(async (orderData: OrderData) => {
    setState(prev => ({ ...prev, isPlacingOrder: true }));
    
    try {
      // 1. Insert into orders
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          subtotal: orderData.subtotal,
          delivery_fee: orderData.delivery_fee,
          service_fee: orderData.service_fee,
          discount: orderData.discount,
          total_amount: orderData.total_amount,
          delivery_address: orderData.delivery_address,
          notes: orderData.notes,
          payment_method: orderData.payment_method,
          status: 'Pending'
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // 2. Insert into order_items
      const itemsToInsert = orderData.items.map(item => ({
        order_id: order.id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        image_url: item.image_url
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
      
      setState(prev => ({ ...prev, isPlacingOrder: false, orderPlaced: true, orderId: order.id }));
      return order.id;
    } catch (error) {
      console.error('Error placing order:', error);
      setState(prev => ({ ...prev, isPlacingOrder: false }));
      throw error;
    }
  }, []);

  return { ...state, setAddress, setPayment, setVoucherCode, applyVoucher, setDeliveryNotes, placeOrder };
}
