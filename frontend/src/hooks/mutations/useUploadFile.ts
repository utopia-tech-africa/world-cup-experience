'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/services/bookingService';
import { useToast } from '@/components/ui/toast';

export const useUploadFile = () => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: uploadFile,
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || 'Failed to upload file. Please try again.';
      addToast(message, 'error', 5000);
    },
  });
};
