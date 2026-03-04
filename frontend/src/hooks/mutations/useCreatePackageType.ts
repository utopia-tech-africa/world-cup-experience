import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPackageType,
  type CreatePackageTypeInput,
} from '@/services/adminService';

export const useCreatePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePackageTypeInput) => createPackageType(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'package-types'] });
    },
  });
};
