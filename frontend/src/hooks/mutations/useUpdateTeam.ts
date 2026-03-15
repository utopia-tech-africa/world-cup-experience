import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeam, type UpdateTeamInput } from '@/services/adminService';

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTeamInput }) =>
      updateTeam(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
    },
  });
};
