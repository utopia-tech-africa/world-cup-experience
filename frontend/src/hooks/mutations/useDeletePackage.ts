import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePackage } from '@/services/adminService';

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
