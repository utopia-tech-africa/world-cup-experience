import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAddon, type UpdateAddonInput } from '@/services/adminService';

export const useUpdateAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAddonInput }) =>
      updateAddon(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'addons'] });
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};
