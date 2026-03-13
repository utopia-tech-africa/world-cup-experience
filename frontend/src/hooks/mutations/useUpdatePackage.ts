import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePackage, type UpdatePackageInput } from '@/services/adminService';

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePackageInput }) =>
      updatePackage(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
