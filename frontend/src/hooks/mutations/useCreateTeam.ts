import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeam, type CreateTeamInput } from '@/services/adminService';

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTeamInput) => createTeam(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
    },
  });
};
