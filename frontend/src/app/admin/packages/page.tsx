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
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useAdminPackages } from '@/hooks/queries/useAdminPackages';
import { useAdminPackageTypes } from '@/hooks/queries/useAdminPackageTypes';
import { useAdminGames } from '@/hooks/queries/useAdminGames';
import { useCreatePackage } from '@/hooks/mutations/useCreatePackage';
import { useUpdatePackage } from '@/hooks/mutations/useUpdatePackage';
import { useDeletePackage } from '@/hooks/mutations/useDeletePackage';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/format';
import { getPackageDurationLabel, nightsBetween } from '@/lib/package-duration';
import type { BookingPackage } from '@/types/booking';

export default function AdminPackagesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: packages = [], isLoading } = useAdminPackages();
  const { data: types = [], isLoading: typesLoading } = useAdminPackageTypes();
  const { data: games = [], isLoading: gamesLoading } = useAdminGames();
  const createPackageMutation = useCreatePackage();
  const updatePackageMutation = useUpdatePackage();
  const deletePackageMutation = useDeletePackage();

  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hostelPrice, setHostelPrice] = useState('');
  const [hotelPrice, setHotelPrice] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  const [editingPkg, setEditingPkg] = useState<BookingPackage | null>(null);
  const [editName, setEditName] = useState('');
  const [editTypeId, setEditTypeId] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editHostelPrice, setEditHostelPrice] = useState('');
  const [editHotelPrice, setEditHotelPrice] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editGameIds, setEditGameIds] = useState<string[]>([]);

  const createNights = nightsBetween(startDate || null, endDate || null);
  const editNights = nightsBetween(editStartDate || null, editEndDate || null);

  useEffect(() => {
    if (types.length > 0 && !typeId) setTypeId(types[0].id);
  }, [types, typeId]);

  useEffect(() => {
    if (editingPkg) {
      setEditName(editingPkg.name);
      setEditTypeId(editingPkg.typeId ?? (editingPkg.type as { id?: string })?.id ?? '');
      setEditStartDate(editingPkg.startDate ?? '');
      setEditEndDate(editingPkg.endDate ?? '');
      setEditHostelPrice(String(editingPkg.hostelPrice));
      setEditHotelPrice(String(editingPkg.hotelPrice));
      setEditDisplayOrder(String(editingPkg.displayOrder));
      setEditIsActive(editingPkg.isActive);
      setEditGameIds(editingPkg.gameIds ?? []);
    }
  }, [editingPkg]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleDelete = async (p: BookingPackage) => {
    if (!confirm(`Delete package "${p.name}"? This cannot be undone.`)) return;
    try {
      await deletePackageMutation.mutateAsync(p.id);
      addToast('Package deleted.', 'success');
      if (editingPkg?.id === p.id) setEditingPkg(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to delete package', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const hostelNum = parseFloat(hostelPrice);
    const hotelNum = parseFloat(hotelPrice);
    const orderNum = parseInt(displayOrder, 10);
    const hasDates = startDate.trim() && endDate.trim();
    if (
      !name.trim() ||
      !typeId ||
      !hasDates ||
      Number.isNaN(hostelNum) ||
      hostelNum <= 0 ||
      Number.isNaN(hotelNum) ||
      hotelNum <= 0
    ) {
      addToast('Please fill name, type, start/end dates, and valid hostel/hotel prices.', 'error');
      return;
    }
    try {
      await createPackageMutation.mutateAsync({
        name: name.trim(),
        typeId,
        startDate: startDate.trim() || undefined,
        endDate: endDate.trim() || undefined,
        hostelPrice: hostelNum,
        hotelPrice: hotelNum,
        displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
        isActive: true,
        gameIds: selectedGameIds.length > 0 ? selectedGameIds : undefined,
      });
      addToast('Package created. It will appear on the landing and booking pages.', 'success');
      setName('');
      setStartDate('');
      setEndDate('');
      setHostelPrice('');
      setHotelPrice('');
      setDisplayOrder('0');
      setSelectedGameIds([]);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to create package', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    const hostelNum = parseFloat(editHostelPrice);
    const hotelNum = parseFloat(editHotelPrice);
    const orderNum = parseInt(editDisplayOrder, 10);
    const hasDates = editStartDate.trim() && editEndDate.trim();
    if (
      !editName.trim() ||
      !hasDates ||
      Number.isNaN(hostelNum) ||
      hostelNum <= 0 ||
      Number.isNaN(hotelNum) ||
      hotelNum <= 0
    ) {
      addToast('Please fill name, start/end dates, and valid prices.', 'error');
      return;
    }
    if (!editTypeId) {
      addToast('Please select a package type.', 'error');
      return;
    }
    try {
      await updatePackageMutation.mutateAsync({
        id: editingPkg.id,
        input: {
          name: editName.trim(),
          typeId: editTypeId,
          startDate: editStartDate.trim() || undefined,
          endDate: editEndDate.trim() || undefined,
          hostelPrice: hostelNum,
          hotelPrice: hotelNum,
          displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
          isActive: editIsActive,
          gameIds: editGameIds,
        },
      });
      addToast('Package updated.', 'success');
      setEditingPkg(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update package', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">
            Packages define game options (e.g. One Game, Double Game) and their hostel/hotel prices. They appear on the landing games section and booking page.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Packages ({packages.length})</CardTitle>
              <CardDescription>
                Shown on the landing page and used for booking pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="text-muted-foreground size-8 animate-spin" />
                </div>
              ) : packages.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No packages yet. Create one in the form to the right.
                </p>
              ) : (
                <ul className="space-y-2">
                  {packages.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({typeof p.type === 'object' && p.type && 'name' in p.type ? p.type.name : p.typeName ?? (typeof p.type === 'string' ? p.type : '')})
                        </span>
                        {!p.isActive && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            (inactive)
                          </span>
                        )}
                        <div className="text-muted-foreground mt-0.5 text-xs">
                          {getPackageDurationLabel(p)} · Hostel {formatCurrency(p.hostelPrice)} · Hotel {formatCurrency(p.hotelPrice)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={() => setEditingPkg(p)}
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p)}
                          disabled={deletePackageMutation.isPending}
                          aria-label={`Delete ${p.name}`}
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
              <CardTitle>Create package</CardTitle>
              <CardDescription>
                New packages appear as game options with hostel/hotel prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pkg-name">Name</Label>
                  <Input
                    id="pkg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. One Game"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pkg-type">Type</Label>
                  <select
                    id="pkg-type"
                    value={typeId}
                    onChange={(e) => setTypeId(e.target.value)}
                    className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                    disabled={typesLoading}
                  >
                    {types.length === 0 && !typesLoading && (
                      <option value="">Create a game type first</option>
                    )}
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Games in this package</Label>
                  <p className="text-muted-foreground text-xs">
                    Select which fixtures appear for this package.
                  </p>
                  {gamesLoading ? (
                    <p className="text-muted-foreground text-sm">Loading games…</p>
                  ) : (
                    <div className="border-input max-h-48 overflow-y-auto rounded-md border bg-muted/30 p-2">
                      {[...games]
                        .sort((a, b) => a.displayOrder - b.displayOrder || (a.matchDate.localeCompare(b.matchDate)))
                        .map((g) => (
                          <label
                            key={g.id}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedGameIds.includes(g.id)}
                              onChange={(e) =>
                                setSelectedGameIds((prev) =>
                                  e.target.checked ? [...prev, g.id] : prev.filter((id) => id !== g.id)
                                )
                              }
                              className="border-input h-4 w-4 rounded"
                            />
                            <span>
                              {g.team1Name} vs {g.team2Name} · {g.matchDate}
                            </span>
                          </label>
                        ))}
                      {games.length === 0 && (
                        <p className="text-muted-foreground py-2 text-sm">No games yet. Add games on the Games page first.</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="pkg-start">Start date</Label>
                    <Input
                      id="pkg-start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pkg-end">End date</Label>
                    <Input
                      id="pkg-end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                {createNights != null && (
                  <p className="text-muted-foreground text-sm">
                    {createNights} night{createNights !== 1 ? 's' : ''}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="pkg-hostel">Hostel price (USD)</Label>
                    <Input
                      id="pkg-hostel"
                      type="number"
                      min="0"
                      step="0.01"
                      value={hostelPrice}
                      onChange={(e) => setHostelPrice(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pkg-hotel">Hotel price (USD)</Label>
                    <Input
                      id="pkg-hotel"
                      type="number"
                      min="0"
                      step="0.01"
                      value={hotelPrice}
                      onChange={(e) => setHotelPrice(e.target.value)}
                      placeholder="1800"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pkg-order">Display order (lower = first)</Label>
                  <Input
                    id="pkg-order"
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createPackageMutation.isPending}
                >
                  {createPackageMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Create package'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Dialog open={editingPkg != null} onOpenChange={(open) => !open && setEditingPkg(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit package</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-pkg-name">Name</Label>
                <Input
                  id="edit-pkg-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. One Game"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-pkg-type">Type</Label>
                <select
                  id="edit-pkg-type"
                  value={editTypeId}
                  onChange={(e) => setEditTypeId(e.target.value)}
                  className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                  disabled={typesLoading}
                >
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Games in this package</Label>
                <p className="text-muted-foreground text-xs">
                  Select which fixtures appear for this package.
                </p>
                {gamesLoading ? (
                  <p className="text-muted-foreground text-sm">Loading games…</p>
                ) : (
                  <div className="border-input max-h-48 overflow-y-auto rounded-md border bg-muted/30 p-2">
                    {[...games]
                      .sort((a, b) => a.displayOrder - b.displayOrder || (a.matchDate.localeCompare(b.matchDate)))
                      .map((g) => (
                        <label
                          key={g.id}
                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            checked={editGameIds.includes(g.id)}
                            onChange={(e) =>
                              setEditGameIds((prev) =>
                                e.target.checked ? [...prev, g.id] : prev.filter((id) => id !== g.id)
                              )
                            }
                            className="border-input h-4 w-4 rounded"
                          />
                          <span>
                            {g.team1Name} vs {g.team2Name} · {g.matchDate}
                          </span>
                        </label>
                      ))}
                    {games.length === 0 && (
                      <p className="text-muted-foreground py-2 text-sm">No games yet. Add games on the Games page first.</p>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-pkg-start">Start date</Label>
                  <Input
                    id="edit-pkg-start"
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-pkg-end">End date</Label>
                  <Input
                    id="edit-pkg-end"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                </div>
              </div>
              {editNights != null && (
                <p className="text-muted-foreground text-sm">
                  {editNights} night{editNights !== 1 ? 's' : ''}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-pkg-hostel">Hostel price (USD)</Label>
                  <Input
                    id="edit-pkg-hostel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editHostelPrice}
                    onChange={(e) => setEditHostelPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-pkg-hotel">Hotel price (USD)</Label>
                  <Input
                    id="edit-pkg-hotel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editHotelPrice}
                    onChange={(e) => setEditHotelPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-pkg-order">Display order</Label>
                <Input
                  id="edit-pkg-order"
                  type="number"
                  min="0"
                  value={editDisplayOrder}
                  onChange={(e) => setEditDisplayOrder(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-pkg-active"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="border-input h-4 w-4 rounded"
                />
                <Label htmlFor="edit-pkg-active" className="font-normal">
                  Active (show on landing and booking)
                </Label>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPkg(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePackageMutation.isPending}>
                  {updatePackageMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
