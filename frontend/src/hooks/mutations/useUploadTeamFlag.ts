import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTeamFlag } from '@/services/adminService';

export const useUploadTeamFlag = (options?: { onSuccess?: (team: { id: string }) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, file }: { teamId: string; file: File }) =>
      uploadTeamFlag(teamId, file),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] });
      options?.onSuccess?.(team);
    },
  });
};
