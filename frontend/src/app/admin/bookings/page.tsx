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
import { Select } from '@/components/ui/select';
import { ArrowLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import { useBookings } from '@/hooks/queries/useBookings';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Booking } from '@/types/booking';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'rejected', label: 'Rejected' },
];

const PAGE_SIZE = 10;

function BookingsTable({
  bookings,
  isLoading,
}: {
  bookings: Booking[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }
  if (bookings.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No bookings match your filters.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-3 font-medium">Reference</th>
            <th className="pb-3 font-medium">Guest</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium text-right pr-4">Amount</th>
            <th className="pb-3 pl-4 font-medium">Date</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b last:border-0">
              <td className="py-3 font-mono text-xs">{b.bookingReference}</td>
              <td className="py-3">{b.fullName}</td>
              <td className="py-3">
                <StatusBadge status={b.bookingStatus} />
              </td>
              <td className="py-3 pr-4 text-right tabular-nums">
                {formatCurrency(Number(b.totalAmount))}
              </td>
              <td className="py-3 pl-4 text-muted-foreground">
                {formatDate(b.submittedAt)}
              </td>
              <td className="py-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/bookings/${b.id}`}>
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingsCards({
  bookings,
  isLoading,
}: {
  bookings: Booking[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }
  if (bookings.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No bookings match your filters.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <Link
          key={b.id}
          href={`/admin/bookings/${b.id}`}
          className="block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                {b.bookingReference}
              </p>
              <p className="font-medium">{b.fullName}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={b.bookingStatus} />
              <span className="text-sm font-medium tabular-nums">
                {formatCurrency(Number(b.totalAmount))}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(b.submittedAt)}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBookings({
    status: status || undefined,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="size-4" aria-label="Back to dashboard" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Bookings</h1>
        </div>
      </header>
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader className="space-y-4">
            <div>
              <CardTitle>All bookings</CardTitle>
              <CardDescription>
                Search and filter by status, then open a booking to confirm or
                reject.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:gap-3">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex-1 md:flex-[0.8]"
              >
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Reference, name, email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9"
                  aria-label="Search bookings"
                />
              </form>
              <Select
                label="Status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="w-full md:flex-[0.2] md:shrink-0"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <BookingsTable bookings={bookings} isLoading={isLoading} />
            </div>
            <div className="md:hidden">
              <BookingsCards bookings={bookings} isLoading={isLoading} />
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <p className="text-muted-foreground text-sm">
                  Page {page} of {totalPages}
                  {pagination?.total != null && (
                    <> · {pagination.total} total</>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
