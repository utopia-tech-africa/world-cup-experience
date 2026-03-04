import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteGame } from '@/services/adminService';

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
};
