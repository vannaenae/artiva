// Paystack Inline Payment Gateway Helper for Artiva

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

export interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in Kobo (NGN * 100)
  currency?: string;
  ref: string;
  metadata?: Record<string, any>;
  callback: (response: { reference: string; status: string; trans: string }) => void;
  onClose: () => void;
}

// A real, live Paystack public key must be supplied via VITE_PAYSTACK_PUBLIC_KEY.
// There is no baked-in fallback key: launching checkout with a fake key would let
// a booking look "paid" in the app without any money actually moving, which is
// the last thing you want in an escrow product.
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
export const isPaystackConfigured = PAYSTACK_PUBLIC_KEY.trim() !== '';

export const generatePaystackRef = (prefix = 'ARTIVA'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

export const triggerPaystackEscrowPayment = (
  email: string,
  amountInNaira: number,
  metadata: Record<string, any>,
  onSuccess: (reference: string) => void,
  onCancel?: () => void,
  onError?: (message: string) => void
) => {
  if (!isPaystackConfigured) {
    onError?.('Payments aren\'t configured yet — no funds have been charged. Please try again later or contact support.');
    return;
  }
  if (!window.PaystackPop) {
    onError?.('The payment gateway failed to load — no funds have been charged. Check your connection and try again.');
    return;
  }

  const amountInKobo = Math.round(amountInNaira * 100);
  const reference = generatePaystackRef('ESCROW');

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amountInKobo,
    currency: 'NGN',
    ref: reference,
    metadata: {
      custom_fields: [
        {
          display_name: 'Platform',
          variable_name: 'platform',
          value: 'Artiva Estate Marketplace',
        },
        {
          display_name: 'Escrow Purpose',
          variable_name: 'escrow_purpose',
          value: metadata.serviceDescription || 'Artisan Service Escrow Hold',
        }
      ],
      ...metadata,
    },
    callback: (response) => {
      onSuccess(response.reference);
    },
    onClose: () => {
      if (onCancel) onCancel();
    },
  });
  handler.openIframe();
};
