'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Pencil, Trash2, ImagePlus } from 'lucide-react';
import { useAdminTeams } from '@/hooks/queries/useAdminTeams';
import { useCreateTeam } from '@/hooks/mutations/useCreateTeam';
import { useUpdateTeam } from '@/hooks/mutations/useUpdateTeam';
import { useDeleteTeam } from '@/hooks/mutations/useDeleteTeam';
import { useUploadTeamFlag } from '@/hooks/mutations/useUploadTeamFlag';
import { useToast } from '@/components/ui/toast';
import type { Team } from '@/types/booking';

export default function AdminTeamsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: teams = [], isLoading } = useAdminTeams();
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const uploadFlagMutation = useUploadTeamFlag({
    onSuccess: (team) => {
      setEditingTeam((prev) => (prev?.id === team.id ? { ...prev, ...team } : prev));
    },
  });

  const [name, setName] = useState('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (editingTeam) {
      setEditName(editingTeam.name);
    }
  }, [editingTeam]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter a team name.', 'error');
      return;
    }
    try {
      await createTeamMutation.mutateAsync({ name: name.trim() });
      addToast('Team added. You can add a flag in the list or when editing.', 'success');
      setName('');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to create team', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    if (!editName.trim()) {
      addToast('Please enter a team name.', 'error');
      return;
    }
    try {
      await updateTeamMutation.mutateAsync({
        id: editingTeam.id,
        input: { name: editName.trim() },
      });
      addToast('Team updated.', 'success');
      setEditingTeam(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update team', 'error');
    }
  };

  const handleFlagFileChange = (teamId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFlagMutation.mutate(
      { teamId, file },
      {
        onSuccess: () => addToast('Flag uploaded.', 'success'),
        onError: (err: unknown) => {
          const message =
            err && typeof err === 'object' && 'response' in err
              ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
              : null;
          addToast(message || 'Failed to upload flag', 'error');
        },
      }
    );
    e.target.value = '';
  };

  const handleDelete = async (t: Team) => {
    if (!confirm(`Delete team "${t.name}"? It cannot be used in games anymore.`)) return;
    try {
      await deleteTeamMutation.mutateAsync(t.id);
      addToast('Team deleted.', 'success');
      if (editingTeam?.id === t.id) setEditingTeam(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to delete team', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">
          Create teams and upload their flags here. When creating a game, you will select two teams.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teams ({teams.length})</CardTitle>
            <CardDescription>Add teams first, then use them when creating games</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
              </div>
            ) : teams.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No teams yet. Add one in the form to the right.
              </p>
            ) : (
              <ul className="space-y-2">
                {teams.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {t.flagUrl ? (
                        <img
                          src={t.flagUrl}
                          alt=""
                          className="size-8 shrink-0 rounded object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded bg-muted text-xs">
                          ?
                        </span>
                      )}
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => setEditingTeam(t)}
                        aria-label={`Edit ${t.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(t)}
                        aria-label={`Delete ${t.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add team</CardTitle>
            <CardDescription>Create a team; you can add or change its flag when editing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Team name</Label>
                <Input
                  id="team-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ghana"
                />
              </div>
              <Button type="submit" disabled={createTeamMutation.isPending}>
                {createTeamMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Add team'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editingTeam != null} onOpenChange={(open) => !open && setEditingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-team-name">Name</Label>
              <Input
                id="edit-team-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            {editingTeam && (
              <div className="grid gap-2">
                <Label>Flag</Label>
                <div className="flex items-center gap-2">
                  {editingTeam.flagUrl ? (
                    <>
                      <img
                        src={editingTeam.flagUrl}
                        alt=""
                        className="size-14 rounded border object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <Label
                          htmlFor="edit-team-flag-upload"
                          className="cursor-pointer text-xs font-normal text-primary hover:underline"
                        >
                          Change
                        </Label>
                        <input
                          id="edit-team-flag-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => handleFlagFileChange(editingTeam.id, e)}
                          disabled={uploadFlagMutation.isPending}
                        />
                      </div>
                    </>
                  ) : (
                    <label className="flex cursor-pointer items-center gap-2 rounded border border-dashed px-3 py-2 text-sm hover:bg-muted/50">
                      <ImagePlus className="size-4 shrink-0" />
                      <span>Upload flag</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => editingTeam && handleFlagFileChange(editingTeam.id, e)}
                        disabled={uploadFlagMutation.isPending}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
            <Button type="submit" disabled={updateTeamMutation.isPending}>
              {updateTeamMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
