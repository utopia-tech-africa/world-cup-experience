'use client';

import { useEffect } from 'react';
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
import {
  LayoutDashboard,
  Calendar,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/queries/useDashboardStats';
import { useBookings } from '@/hooks/queries/useBookings';
import { formatCurrency, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/admin/status-badge';
import type { Booking } from '@/types/booking';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className = '',
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground size-4 shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

function RecentBookingsTable({ bookings }: { bookings: Booking[] }) {
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

function RecentBookingsCards({ bookings }: { bookings: Booking[] }) {
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings({
    limit: 5,
    page: 1,
  });

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/admin/login');
    router.refresh();
  };

  const bookings = bookingsData?.bookings ?? [];

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <LayoutDashboard className="size-5" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Log out
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage World Cup Experience bookings
          </p>
        </div>

        {/* Metrics */}
        <section>
          <h2 className="sr-only">Overview metrics</h2>
          {statsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      <Loader2 className="text-muted-foreground size-4 animate-spin" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total bookings"
                value={stats.totalBookings}
                icon={Calendar}
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                description="Awaiting review"
                icon={Clock}
              />
              <StatCard
                title="Confirmed"
                value={stats.confirmed}
                icon={CheckCircle}
              />
              <StatCard
                title="Revenue (confirmed)"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
              />
            </div>
          ) : null}
        </section>

        {/* Recent bookings */}
        <section>
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Recent bookings</CardTitle>
                <CardDescription>
                  Latest submissions across all statuses
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/bookings">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-muted-foreground size-8 animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No bookings yet
                </p>
              ) : (
                <>
                  <div className="hidden md:block">
                    <RecentBookingsTable bookings={bookings} />
                  </div>
                  <div className="md:hidden">
                    <RecentBookingsCards bookings={bookings} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
