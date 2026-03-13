import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGame, type UpdateGameInput } from '@/services/adminService';

export const useUpdateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGameInput }) =>
      updateGame(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
};
