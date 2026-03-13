import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGame, type CreateGameInput } from '@/services/adminService';

export const useCreateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGameInput) => createGame(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
};
