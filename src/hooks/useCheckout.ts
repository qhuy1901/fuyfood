import { useState, useCallback } from 'react';

interface CheckoutState {
  selectedAddressId: string;
  selectedPaymentId: string;
  voucherCode: string;
  voucherApplied: boolean;
  deliveryNotes: string;
  isPlacingOrder: boolean;
  orderPlaced: boolean;
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

  const placeOrder = useCallback(() => {
    setState(prev => ({ ...prev, isPlacingOrder: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isPlacingOrder: false, orderPlaced: true }));
    }, 2000);
  }, []);

  return { ...state, setAddress, setPayment, setVoucherCode, applyVoucher, setDeliveryNotes, placeOrder };
}
