'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/services/bookingService';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
    onError: (error: any) => {
      console.error('File upload failed:', error);
    },
  });
};
