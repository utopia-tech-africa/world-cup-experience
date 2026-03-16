'use client';

import { useMutation } from '@tanstack/react-query';
import {
  initPaystackPayment,
  InitPaystackPayload,
  InitPaystackResponse,
} from '@/services/paymentService';
import { useToast } from '@/components/ui/toast';

export const useInitPaystack = () => {
  const { addToast } = useToast();

  return useMutation<InitPaystackResponse, unknown, InitPaystackPayload>({
    mutationFn: initPaystackPayment,
    onError: (error: unknown) => {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : null;
      addToast(
        message || 'Failed to start Paystack payment. Please try again.',
        'error',
        5000
      );
    },
  });
};

