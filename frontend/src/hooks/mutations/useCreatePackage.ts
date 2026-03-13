import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPackage, type CreatePackageInput } from '@/services/adminService';

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePackageInput) => createPackage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'packages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
