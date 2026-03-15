import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeam } from '@/services/adminService';

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
    },
  });
};
