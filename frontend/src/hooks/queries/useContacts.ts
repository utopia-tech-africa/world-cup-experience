import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContactMessages,
  updateContactStatus,
} from "@/services/contactService";

export function useContacts() {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: getContactMessages,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    contacts: contactsQuery.data ?? [],
    isLoading: contactsQuery.isLoading,
    error: contactsQuery.error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    updatingId: updateStatusMutation.isPending
      ? updateStatusMutation.variables?.id
      : null,
  };
}
