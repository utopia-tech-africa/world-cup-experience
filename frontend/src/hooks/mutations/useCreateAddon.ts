import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAddon, type CreateAddonInput } from '@/services/adminService';

export const useCreateAddon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAddonInput) => createAddon(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'addons'] });
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });
};
