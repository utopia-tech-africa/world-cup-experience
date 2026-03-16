import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFxRate } from '@/services/adminService';

export const useUpdateFxRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (usdToGhsRate: number) => updateFxRate(usdToGhsRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'fx-rate'] });
    },
  });
};
