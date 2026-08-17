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

export const PAYSTACK_PUBLIC_KEY = 
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_artiva_demo_key_992184';

export const generatePaystackRef = (prefix = 'ARTIVA'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

export const triggerPaystackEscrowPayment = (
  email: string,
  amountInNaira: number,
  metadata: Record<string, any>,
  onSuccess: (reference: string) => void,
  onCancel?: () => void
) => {
  const amountInKobo = Math.round(amountInNaira * 100);
  const reference = generatePaystackRef('ESCROW');

  // Check if Paystack script is loaded on window
  if (window.PaystackPop) {
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
  } else {
    // Fallback sandbox simulation if offline or script blocked
    const simulatedRef = generatePaystackRef('SIM_PAYSTACK');
    const confirmed = window.confirm(
      `[Paystack NGN Gateway Simulation]\n\nAmount: ₦${amountInNaira.toLocaleString()}\nEmail: ${email}\nReference: ${simulatedRef}\n\nClick OK to simulate successful Paystack NGN Escrow Deposit.`
    );
    if (confirmed) {
      onSuccess(simulatedRef);
    } else if (onCancel) {
      onCancel();
    }
  }
};
