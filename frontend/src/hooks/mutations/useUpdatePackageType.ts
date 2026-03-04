import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updatePackageType,
  type UpdatePackageTypeInput,
} from '@/services/adminService';

export const useUpdatePackageType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePackageTypeInput }) =>
      updatePackageType(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'package-types'] });
    },
  });
};
