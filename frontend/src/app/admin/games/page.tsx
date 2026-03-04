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
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useAdminGames } from '@/hooks/queries/useAdminGames';
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
  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();
  const deleteGameMutation = useDeleteGame();

  const [stadium, setStadium] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [editStadium, setEditStadium] = useState('');
  const [editTeam1Name, setEditTeam1Name] = useState('');
  const [editTeam2Name, setEditTeam2Name] = useState('');
  const [editMatchDate, setEditMatchDate] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');

  useEffect(() => {
    if (editingGame) {
      setEditStadium(editingGame.stadium);
      setEditTeam1Name(editingGame.team1Name);
      setEditTeam2Name(editingGame.team2Name);
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
    if (!stadium.trim() || !team1Name.trim() || !team2Name.trim() || !matchDate.trim()) {
      addToast('Please fill stadium, both teams and match date.', 'error');
      return;
    }
    const dateForApi = new Date(matchDate + 'T12:00:00');
    try {
      await createGameMutation.mutateAsync({
        stadium: stadium.trim(),
        team1Name: team1Name.trim(),
        team2Name: team2Name.trim(),
        matchDate: formatMatchDate(dateForApi),
        displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
      });
      addToast('Game added. Add it to packages via the Packages page.', 'success');
      setStadium('');
      setTeam1Name('');
      setTeam2Name('');
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
    if (!editStadium.trim() || !editTeam1Name.trim() || !editTeam2Name.trim() || !editMatchDate.trim()) {
      addToast('Please fill stadium, both teams and match date.', 'error');
      return;
    }
    const dateForApi = new Date(editMatchDate + 'T12:00:00');
    try {
      await updateGameMutation.mutateAsync({
        id: editingGame.id,
        input: {
          stadium: editStadium.trim(),
          team1Name: editTeam1Name.trim(),
          team2Name: editTeam2Name.trim(),
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
    if (!confirm(`Delete "${g.team1Name} vs ${g.team2Name}" at ${g.stadium}?`)) return;
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
          Add match fixtures (stadium, teams, date). Link games to packages on the Packages page.
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
                No games yet. Add one in the form to the right.
              </p>
            ) : (
              <ul className="space-y-2">
                {games.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="font-medium">{g.team1Name} vs {g.team2Name}</span>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {g.stadium} · {g.matchDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => setEditingGame(g)}
                        aria-label={`Edit ${g.team1Name} vs ${g.team2Name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(g)}
                        aria-label={`Delete ${g.team1Name} vs ${g.team2Name}`}
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
              Add a fixture; link it to packages on the Packages page
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
                <div className="grid gap-2">
                  <Label htmlFor="game-team1">Team 1</Label>
                  <Input
                    id="game-team1"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    placeholder="e.g. Ghana"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="game-team2">Team 2</Label>
                  <Input
                    id="game-team2"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    placeholder="e.g. Croatia"
                  />
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
              <Button type="submit" disabled={createGameMutation.isPending}>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-game-team1">Team 1</Label>
                <Input
                  id="edit-game-team1"
                  value={editTeam1Name}
                  onChange={(e) => setEditTeam1Name(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-game-team2">Team 2</Label>
                <Input
                  id="edit-game-team2"
                  value={editTeam2Name}
                  onChange={(e) => setEditTeam2Name(e.target.value)}
                />
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
