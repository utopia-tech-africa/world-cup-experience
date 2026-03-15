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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useAdminGames } from '@/hooks/queries/useAdminGames';
import { useAdminTeams } from '@/hooks/queries/useAdminTeams';
import { useCreateGame } from '@/hooks/mutations/useCreateGame';
import { useUpdateGame } from '@/hooks/mutations/useUpdateGame';
import { useDeleteGame } from '@/hooks/mutations/useDeleteGame';
import { useToast } from '@/components/ui/toast';
import { formatMatchDate, parseMatchDate } from '@/lib/match-date';
import type { AdminGame } from '@/types/booking';

export default function AdminGamesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: games = [], isLoading } = useAdminGames();
  const { data: teams = [] } = useAdminTeams();
  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();
  const deleteGameMutation = useDeleteGame();

  const [stadium, setStadium] = useState('');
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [editStadium, setEditStadium] = useState('');
  const [editTeam1Id, setEditTeam1Id] = useState('');
  const [editTeam2Id, setEditTeam2Id] = useState('');
  const [editMatchDate, setEditMatchDate] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');

  useEffect(() => {
    if (editingGame) {
      setEditStadium(editingGame.stadium);
      setEditTeam1Id(editingGame.team1Id);
      setEditTeam2Id(editingGame.team2Id);
      setEditMatchDate(
        (() => {
          const d = parseMatchDate(editingGame.matchDate);
          return d ? d.toISOString().slice(0, 10) : '';
        })()
      );
      setEditDisplayOrder(String(editingGame.displayOrder));
    }
  }, [editingGame]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = parseInt(displayOrder, 10);
    if (!stadium.trim() || !team1Id || !team2Id || !matchDate.trim()) {
      addToast('Please fill stadium, both teams and match date.', 'error');
      return;
    }
    if (team1Id === team2Id) {
      addToast('Team 1 and Team 2 must be different.', 'error');
      return;
    }
    const dateForApi = new Date(matchDate + 'T12:00:00');
    try {
      await createGameMutation.mutateAsync({
        stadium: stadium.trim(),
        team1Id,
        team2Id,
        matchDate: formatMatchDate(dateForApi),
        displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
      });
      addToast('Game added. Add it to packages via the Packages page.', 'success');
      setStadium('');
      setTeam1Id('');
      setTeam2Id('');
      setMatchDate('');
      setDisplayOrder('0');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to create game', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    const orderNum = parseInt(editDisplayOrder, 10);
    if (!editStadium.trim() || !editTeam1Id || !editTeam2Id || !editMatchDate.trim()) {
      addToast('Please fill stadium, both teams and match date.', 'error');
      return;
    }
    if (editTeam1Id === editTeam2Id) {
      addToast('Team 1 and Team 2 must be different.', 'error');
      return;
    }
    const dateForApi = new Date(editMatchDate + 'T12:00:00');
    try {
      await updateGameMutation.mutateAsync({
        id: editingGame.id,
        input: {
          typeId: editingGame.typeId ?? null,
          stadium: editStadium.trim(),
          team1Id: editTeam1Id,
          team2Id: editTeam2Id,
          matchDate: formatMatchDate(dateForApi),
          displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
        },
      });
      addToast('Game updated.', 'success');
      setEditingGame(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update game', 'error');
    }
  };

  const handleDelete = async (g: AdminGame) => {
    if (!confirm(`Delete "${g.team1.name} vs ${g.team2.name}" at ${g.stadium}?`)) return;
    try {
      await deleteGameMutation.mutateAsync(g.id);
      addToast('Game deleted.', 'success');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to delete game', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Games</h1>
        <p className="text-muted-foreground">
          Create fixtures by selecting two teams (create teams and upload flags on the Teams page first). Link games to packages on the Packages page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fixtures ({games.length})</CardTitle>
            <CardDescription>
              Order by display order and match date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
              </div>
            ) : games.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No games yet. Add teams first, then add a game here.
              </p>
            ) : (
              <ul className="space-y-2">
                {games.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1">
                        {g.team1.flagUrl ? (
                          <img
                            src={g.team1.flagUrl}
                            alt=""
                            className="size-6 rounded object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground flex size-6 items-center justify-center rounded bg-muted text-[10px]">1</span>
                        )}
                        {g.team2.flagUrl ? (
                          <img
                            src={g.team2.flagUrl}
                            alt=""
                            className="size-6 rounded object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground flex size-6 items-center justify-center rounded bg-muted text-[10px]">2</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium">{g.team1.name} vs {g.team2.name}</span>
                        <div className="text-muted-foreground mt-0.5 text-xs">
                          {g.stadium} · {g.matchDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => setEditingGame(g)}
                        aria-label={`Edit ${g.team1.name} vs ${g.team2.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(g)}
                        aria-label={`Delete ${g.team1.name} vs ${g.team2.name}`}
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
            <CardTitle>Add game</CardTitle>
            <CardDescription>
              Select two teams; create teams on the Teams page if needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="game-stadium">Stadium</Label>
                <Input
                  id="game-stadium"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="e.g. Philadelphia Stadium, USA"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid w-full min-w-0 flex-1 gap-2">
                  <Label htmlFor="game-team1">Team 1</Label>
<Select
                    value={team1Id}
                    onValueChange={(v) => setTeam1Id(v ?? "")}
                    items={teams.map((t) => ({ value: t.id, label: t.name }))}
                  >
                  <SelectTrigger id="game-team1" className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          <span className="flex items-center gap-2">
                            {t.flagUrl && (
                              <img
                                src={t.flagUrl}
                                alt=""
                                className="size-4 rounded object-cover"
                              />
                            )}
                            {t.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full min-w-0 flex-1 gap-2">
                  <Label htmlFor="game-team2">Team 2</Label>
<Select
                    value={team2Id}
                    onValueChange={(v) => setTeam2Id(v ?? "")}
                    items={teams.map((t) => ({ value: t.id, label: t.name }))}
                  >
                  <SelectTrigger id="game-team2" className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          <span className="flex items-center gap-2">
                            {t.flagUrl && (
                              <img
                                src={t.flagUrl}
                                alt=""
                                className="size-4 rounded object-cover"
                              />
                            )}
                            {t.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-date">Match date</Label>
                <Input
                  id="game-date"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-order">Display order</Label>
                <Input
                  id="game-order"
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>
              {teams.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No teams yet. Go to the Teams page to add teams and their flags first.
                </p>
              )}
              <Button
                type="submit"
                disabled={createGameMutation.isPending || teams.length < 2}
              >
                {createGameMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Add game'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editingGame != null} onOpenChange={(open) => !open && setEditingGame(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit game</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-game-stadium">Stadium</Label>
              <Input
                id="edit-game-stadium"
                value={editStadium}
                onChange={(e) => setEditStadium(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid w-full min-w-0 flex-1 gap-2">
                <Label htmlFor="edit-game-team1">Team 1</Label>
                <Select
                    value={editTeam1Id}
                    onValueChange={(v) => setEditTeam1Id(v ?? "")}
                    items={teams.map((t) => ({ value: t.id, label: t.name }))}
                  >
                  <SelectTrigger id="edit-game-team1" className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <span className="flex items-center gap-2">
                          {t.flagUrl && (
                            <img
                              src={t.flagUrl}
                              alt=""
                              className="size-4 rounded object-cover"
                            />
                          )}
                          {t.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full min-w-0 flex-1 gap-2">
                <Label htmlFor="edit-game-team2">Team 2</Label>
                <Select
                    value={editTeam2Id}
                    onValueChange={(v) => setEditTeam2Id(v ?? "")}
                    items={teams.map((t) => ({ value: t.id, label: t.name }))}
                  >
                  <SelectTrigger id="edit-game-team2" className="w-full">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <span className="flex items-center gap-2">
                          {t.flagUrl && (
                            <img
                              src={t.flagUrl}
                              alt=""
                              className="size-4 rounded object-cover"
                            />
                          )}
                          {t.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-game-date">Match date</Label>
              <Input
                id="edit-game-date"
                type="date"
                value={editMatchDate}
                onChange={(e) => setEditMatchDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-game-order">Display order</Label>
              <Input
                id="edit-game-order"
                type="number"
                min="0"
                value={editDisplayOrder}
                onChange={(e) => setEditDisplayOrder(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={updateGameMutation.isPending}>
              {updateGameMutation.isPending ? (
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
