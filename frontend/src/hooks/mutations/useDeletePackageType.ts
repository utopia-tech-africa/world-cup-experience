import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePackageType } from '@/services/adminService';

export const useDeletePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePackageType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'package-types'] });
    },
  });
};
