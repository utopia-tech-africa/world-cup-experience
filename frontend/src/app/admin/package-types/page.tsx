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
import { useAdminPackageTypes } from '@/hooks/queries/useAdminPackageTypes';
import { useCreatePackageType } from '@/hooks/mutations/useCreatePackageType';
import { useUpdatePackageType } from '@/hooks/mutations/useUpdatePackageType';
import { useDeletePackageType } from '@/hooks/mutations/useDeletePackageType';
import { useToast } from '@/components/ui/toast';
import type { GamePackageType } from '@/types/booking';

export default function AdminPackageTypesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: types = [], isLoading } = useAdminPackageTypes();
  const createTypeMutation = useCreatePackageType();
  const updateTypeMutation = useUpdatePackageType();
  const deleteTypeMutation = useDeletePackageType();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [editingType, setEditingType] = useState<GamePackageType | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');

  useEffect(() => {
    if (editingType) {
      setEditName(editingType.name);
      setEditCode(editingType.code);
      setEditDisplayOrder(String(editingType.displayOrder));
    }
  }, [editingType]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const derivedCode = name.trim()
    ? name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    : '';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = parseInt(displayOrder, 10);
    const codeTrim = code.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const finalCode = codeTrim || derivedCode;
    if (!name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }
    if (!finalCode) {
      addToast('Code could not be generated from name; use letters, numbers or spaces.', 'error');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(finalCode)) {
      addToast('Code must contain only lowercase letters, numbers and underscores.', 'error');
      return;
    }
    try {
      await createTypeMutation.mutateAsync({
        name: name.trim(),
        code: finalCode,
        displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
      });
      addToast('Game type created. You can use it when creating packages.', 'success');
      setName('');
      setCode('');
      setDisplayOrder('0');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to create game type', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    const orderNum = parseInt(editDisplayOrder, 10);
    const codeTrim = editCode.trim().toLowerCase().replace(/\s+/g, '_');
    if (!editName.trim() || !codeTrim) {
      addToast('Name and code are required.', 'error');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(codeTrim)) {
      addToast('Code must contain only lowercase letters, numbers and underscores.', 'error');
      return;
    }
    try {
      await updateTypeMutation.mutateAsync({
        id: editingType.id,
        input: {
          name: editName.trim(),
          code: codeTrim,
          displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
        },
      });
      addToast('Game type updated.', 'success');
      setEditingType(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update game type', 'error');
    }
  };

  const handleDelete = async (t: GamePackageType) => {
    if (!confirm(`Delete "${t.name}"? This will fail if any packages use this type.`)) return;
    try {
      await deleteTypeMutation.mutateAsync(t.id);
      addToast('Game type deleted.', 'success');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to delete game type', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Game types</h1>
          <p className="text-muted-foreground">
            Create types for packages (e.g. Single game, Double game, Triple game). Each package you create must use one of these types.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Types ({types.length})</CardTitle>
              <CardDescription>
                Used when creating packages; the code is stored on bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="text-muted-foreground size-8 animate-spin" />
                </div>
              ) : types.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No types yet. Create one in the form to the right.
                </p>
              ) : (
                <ul className="space-y-2">
                  {types.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">{t.name}</span>
                        <span className="text-muted-foreground ml-2">({t.code})</span>
                        <span className="text-muted-foreground ml-2 text-xs">order: {t.displayOrder}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={() => setEditingType(t)}
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
              <CardTitle>Create game type</CardTitle>
              <CardDescription>
                Enter the name; code is generated automatically (e.g. Single game → single_game). You can override the code if needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type-name">Name</Label>
                  <Input
                    id="type-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Single game"
                  />
                  {derivedCode && (
                    <p className="text-muted-foreground text-xs">
                      Code will be: <code className="rounded bg-muted px-1">{derivedCode}</code>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type-code">Code (optional – leave empty to use generated)</Label>
                  <Input
                    id="type-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={derivedCode || 'e.g. single_game'}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type-order">Display order (lower = first)</Label>
                  <Input
                    id="type-order"
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createTypeMutation.isPending}
                >
                  {createTypeMutation.isPending ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    'Create game type'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Dialog open={editingType != null} onOpenChange={(open) => !open && setEditingType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit game type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type-name">Name</Label>
                <Input
                  id="edit-type-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type-code">Code</Label>
                <Input
                  id="edit-type-code"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type-order">Display order</Label>
                <Input
                  id="edit-type-order"
                  type="number"
                  min="0"
                  value={editDisplayOrder}
                  onChange={(e) => setEditDisplayOrder(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={updateTypeMutation.isPending}>
                {updateTypeMutation.isPending ? (
                  <Loader2 className="animate-spin size-4" />
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
