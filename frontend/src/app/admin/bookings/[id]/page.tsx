'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useBookingDetail } from '@/hooks/queries/useBookingDetail';
import { useConfirmBooking } from '@/hooks/mutations/useConfirmBooking';
import { useRejectBooking } from '@/hooks/mutations/useRejectBooking';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import type { Booking } from '@/types/booking';

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-2 sm:flex-row sm:py-1.5">
      <dt className="text-muted-foreground min-w-[140px] text-sm">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default function AdminBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data: booking, isLoading, error, refetch } = useBookingDetail(id);
  const confirmMutation = useConfirmBooking();
  const rejectMutation = useRejectBooking();
  const { addToast } = useToast();

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleConfirm = () => {
    if (!id) return;
    confirmMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          addToast('Booking confirmed successfully', 'success');
          // Small delay to show toast, then refetch to get latest status
          setTimeout(() => {
            void refetch();
          }, 100);
        },
        onError: (error: unknown) => {
          let message = 'Failed to confirm booking';
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.error;
            if (errorMessage?.includes('User not found')) {
              message = 'Your session has expired. Please log out and log back in.';
            } else {
              message = errorMessage ?? 
                (axiosError.response?.status === 500 ? 'Server error. Please try again.' : message);
            }
          } else if (error instanceof Error) {
            message = error.message;
          }
          addToast(message, 'error');
          console.error('Confirm booking error:', error);
        },
      }
    );
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !rejectReason.trim()) return;
    rejectMutation.mutate(
      { id, rejectionReason: rejectReason.trim() },
      {
        onSuccess: () => {
          setRejectReason('');
          setShowRejectForm(false);
          addToast('Booking rejected successfully', 'success');
          setTimeout(() => void refetch(), 100);
        },
        onError: (error: unknown) => {
          let message = 'Failed to reject booking';
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { error?: string } } };
            message = axiosError.response?.data?.error ?? message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          addToast(message, 'error');
        },
      }
    );
  };

  if (isLoading || !booking) {
    return (
      <div className="flex items-center justify-center p-8">
        {error ? (
          <p className="text-destructive">Failed to load booking.</p>
        ) : (
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
        )}
      </div>
    );
  }

  const isPending = booking.bookingStatus === 'pending';

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/bookings">
            <ArrowLeft className="size-4" aria-label="Back to bookings" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {booking.bookingReference}
        </h1>
        <StatusBadge status={booking.bookingStatus} />
      </div>
        {/* Actions for pending */}
        {isPending && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
              <CardDescription>
                Confirm or reject this booking. The guest will receive an
                email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showRejectForm ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleConfirm}
                    disabled={confirmMutation.isPending}
                  >
                    {confirmMutation.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 size-4" />
                    )}
                    Confirm booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="mr-2 size-4" />
                    Reject booking
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleRejectSubmit}
                  className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
                >
                  <label htmlFor="reject-reason" className="text-sm font-medium">
                    Rejection reason (required)
                  </label>
                  <textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Passport expiry too close to travel date"
                    required
                    rows={3}
                    className={cn(
                      'border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs',
                      'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                      'min-h-[80px] resize-y'
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={
                        !rejectReason.trim() || rejectMutation.isPending
                      }
                    >
                      {rejectMutation.isPending ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : null}
                      Confirm rejection
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                      }}
                      disabled={rejectMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Guest & trip details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guest & trip details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <dl className="divide-y">
              <DetailRow label="Full name" value={booking.fullName} />
              <DetailRow label="Email" value={booking.email} />
              <DetailRow label="Phone" value={booking.phone} />
              <DetailRow
                label="Passport number"
                value={booking.passportNumber}
              />
              <DetailRow
                label="Passport expiry"
                value={formatDate(booking.passportExpiry)}
              />
              <DetailRow
                label="Package"
                value={booking.packageType.replace('_', ' ')}
              />
              <DetailRow
                label="Accommodation"
                value={booking.accommodationType}
              />
              <DetailRow
                label="Travelers"
                value={booking.numberOfTravelers}
              />
              <DetailRow
                label="Payment account"
                value={booking.paymentAccountType}
              />
              {booking.specialRequests ? (
                <DetailRow
                  label="Special requests"
                  value={booking.specialRequests}
                />
              ) : null}
              <DetailRow
                label="Submitted"
                value={formatDate(booking.submittedAt)}
              />
              {booking.confirmedAt && (
                <DetailRow
                  label="Confirmed"
                  value={formatDate(booking.confirmedAt)}
                />
              )}
              {booking.rejectionReason && (
                <DetailRow
                  label="Rejection reason"
                  value={
                    <span className="text-destructive">
                      {booking.rejectionReason}
                    </span>
                  }
                />
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Add-ons */}
        {booking.bookingAddOns?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add-ons</CardTitle>
              <CardDescription>
                Selected at time of booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {booking.bookingAddOns.map((ba: { id: string; quantity: number; priceAtBooking: number; addOn: { name: string } }) => {
                  const addOn = ba.addOn;
                  const quantity = ba.quantity;
                  const priceAtBooking = ba.priceAtBooking;
                  return (
                    <li
                      key={ba.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <span>{addOn.name}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {quantity} × {formatCurrency(Number(priceAtBooking))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <dl className="divide-y">
              <DetailRow
                label="Base package"
                value={formatCurrency(Number(booking.basePackagePrice))}
              />
              <DetailRow
                label="Add-ons total"
                value={formatCurrency(Number(booking.addonsTotalPrice))}
              />
              <DetailRow
                label="Total amount"
                value={
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(Number(booking.totalAmount))}
                  </span>
                }
              />
            </dl>
          </CardContent>
        </Card>

        {/* Payment proof */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment proof</CardTitle>
            <CardDescription>
              Document uploaded by the guest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <a
                href={booking.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 size-4" />
                Open payment proof
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
