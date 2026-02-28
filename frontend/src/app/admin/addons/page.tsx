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
  LayoutDashboard,
  LogOut,
  Loader2,
  Package,
} from 'lucide-react';
import { useAdminAddons } from '@/hooks/queries/useAdminAddons';
import { useCreateAddon } from '@/hooks/mutations/useCreateAddon';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/format';
import type { AddOn } from '@/types/booking';

const CATEGORIES: Array<AddOn['category']> = ['merch', 'transport', 'experience', 'food'];

export default function AdminAddonsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: addons = [], isLoading } = useAdminAddons();
  const createAddonMutation = useCreateAddon();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<AddOn['category']>('merch');
  const [displayOrder, setDisplayOrder] = useState('0');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/admin/login');
    router.refresh();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const orderNum = parseInt(displayOrder, 10);
    if (!name.trim() || !description.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      addToast('Please fill name, description, and a valid price.', 'error');
      return;
    }
    try {
      await createAddonMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
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

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <LayoutDashboard className="size-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/admin/addons"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
            >
              <Package className="size-4" />
              Add-ons
            </Link>
          </nav>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Log out
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-4 md:p-6">
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
                      className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-medium">{a.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({a.category})
                        </span>
                      </div>
                      <span className="tabular-nums">{formatCurrency(a.price)}</span>
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
                  <Label htmlFor="addon-desc">Description</Label>
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
      </main>
    </div>
  );
}
