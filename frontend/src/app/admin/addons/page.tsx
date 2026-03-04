'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Pencil } from 'lucide-react';
import { useAdminAddons } from '@/hooks/queries/useAdminAddons';
import { useCreateAddon } from '@/hooks/mutations/useCreateAddon';
import { useUpdateAddon } from '@/hooks/mutations/useUpdateAddon';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/format';
import type { AddOn } from '@/types/booking';

const CATEGORIES: Array<AddOn['category']> = ['merch', 'transport', 'experience', 'food'];

export default function AdminAddonsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: addons = [], isLoading } = useAdminAddons();
  const createAddonMutation = useCreateAddon();
  const updateAddonMutation = useUpdateAddon();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<AddOn['category']>('merch');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState<AddOn['category']>('merch');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);

  useEffect(() => {
    if (editingAddon) {
      setEditName(editingAddon.name);
      setEditDescription(editingAddon.description ?? '');
      setEditPrice(String(editingAddon.price));
      setEditCategory(editingAddon.category);
      setEditDisplayOrder(String(editingAddon.displayOrder));
      setEditIsActive(editingAddon.isActive);
    }
  }, [editingAddon]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const orderNum = parseInt(displayOrder, 10);
    if (!name.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      addToast('Please fill name and a valid price.', 'error');
      return;
    }
    try {
      await createAddonMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || '',
        price: priceNum,
        category,
        displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
        isActive: true,
      });
      addToast('Add-on created. It will appear on the booking page.', 'success');
      setName('');
      setDescription('');
      setPrice('');
      setDisplayOrder('0');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : null;
      addToast(message || 'Failed to create add-on', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddon) return;
    const priceNum = parseFloat(editPrice);
    const orderNum = parseInt(editDisplayOrder, 10);
    if (!editName.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      addToast('Please fill name and a valid price.', 'error');
      return;
    }
    try {
      await updateAddonMutation.mutateAsync({
        id: editingAddon.id,
        input: {
          name: editName.trim(),
          description: editDescription.trim() || '',
          price: priceNum,
          category: editCategory,
          displayOrder: Number.isNaN(orderNum) ? 0 : orderNum,
          isActive: editIsActive,
        },
      });
      addToast('Add-on updated.', 'success');
      setEditingAddon(null);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : null;
      addToast(message || 'Failed to update add-on', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add-ons</h1>
          <p className="text-muted-foreground">
            Add-ons appear on the booking page for customers to choose. Create one below.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* List */}
          <Card>
            <CardHeader>
              <CardTitle>Active add-ons ({addons.length})</CardTitle>
              <CardDescription>
                Shown on the booking page in display order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="text-muted-foreground size-8 animate-spin" />
                </div>
              ) : addons.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No add-ons yet. Create one in the form to the right.
                </p>
              ) : (
                <ul className="space-y-2">
                  {addons.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">{a.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({a.category})
                        </span>
                        {!a.isActive && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            (inactive)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">{formatCurrency(a.price)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={() => setEditingAddon(a)}
                          aria-label={`Edit ${a.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Create form */}
          <Card>
            <CardHeader>
              <CardTitle>Create add-on</CardTitle>
              <CardDescription>
                New add-ons appear on the booking page for customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="addon-name">Name</Label>
                  <Input
                    id="addon-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Merch Bundle"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="addon-desc">Description (optional)</Label>
                  <Textarea
                    id="addon-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description for the add-on"
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="addon-price">Price (USD)</Label>
                  <Input
                    id="addon-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="75"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="addon-category">Category</Label>
                  <select
                    id="addon-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AddOn['category'])}
                    className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="addon-order">Display order (lower = first)</Label>
                  <Input
                    id="addon-order"
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createAddonMutation.isPending}
                >
                  {createAddonMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Create add-on'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Edit add-on dialog */}
        <Dialog
          open={editingAddon != null}
          onOpenChange={(open) => !open && setEditingAddon(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit add-on</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-addon-name">Name</Label>
                <Input
                  id="edit-addon-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Merch Bundle"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-addon-desc">Description (optional)</Label>
                <Textarea
                  id="edit-addon-desc"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Short description"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-addon-price">Price (USD)</Label>
                <Input
                  id="edit-addon-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-addon-category">Category</Label>
                <select
                  id="edit-addon-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as AddOn['category'])}
                  className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-addon-order">Display order (lower = first)</Label>
                <Input
                  id="edit-addon-order"
                  type="number"
                  min="0"
                  value={editDisplayOrder}
                  onChange={(e) => setEditDisplayOrder(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-addon-active"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="border-input h-4 w-4 rounded"
                />
                <Label htmlFor="edit-addon-active" className="font-normal">
                  Active (show on booking page)
                </Label>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAddon(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAddonMutation.isPending}>
                  {updateAddonMutation.isPending ? (
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
