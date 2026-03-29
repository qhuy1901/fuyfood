import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { vouchers, type Voucher } from '../data/mockData';

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
  deliveryNotes: string;
  appliedVoucher: Voucher | null;
  isPlacingOrder: boolean;
  orderPlaced: boolean;
  orderId: string | null;
}

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({
    selectedAddressId: 'a1',
    selectedPaymentId: 'pm1',
    voucherCode: '',
    appliedVoucher: null,
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
    const voucher = vouchers.find(v => v.code.toUpperCase() === state.voucherCode.toUpperCase());
    setState(prev => ({ ...prev, appliedVoucher: voucher || null }));
    return !!voucher;
  }, [state.voucherCode]);

  const selectVoucher = useCallback((voucher: Voucher) => {
    setState(prev => ({ ...prev, appliedVoucher: voucher, voucherCode: voucher.code }));
  }, []);

  const setDeliveryNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, deliveryNotes: notes }));
  }, []);

  const placeOrder = useCallback(async (orderData: OrderData) => {
    setState(prev => ({ ...prev, isPlacingOrder: true }));
    
    try {
      // 1. Insert into orders
      const now = new Date();
      const deliveredAt = new Date(now.getTime() + 120000); // 2 minutes from now for quick testing

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
          status: 'Pending',
          delivered_at: deliveredAt.toISOString()
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

  return { ...state, setAddress, setPayment, setVoucherCode, applyVoucher, selectVoucher, setDeliveryNotes, placeOrder };
}
