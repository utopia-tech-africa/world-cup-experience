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
import { Loader2 } from 'lucide-react';
import { useFxRate } from '@/hooks/queries/useFxRate';
import { useUpdateFxRate } from '@/hooks/mutations/useUpdateFxRate';
import { useToast } from '@/components/ui/toast';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { data: currentRate, isLoading } = useFxRate();
  const updateFxRateMutation = useUpdateFxRate();

  const [rateInput, setRateInput] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  useEffect(() => {
    if (currentRate != null && !touched) {
      setRateInput(String(currentRate));
    } else if (currentRate == null && !touched && !isLoading) {
      setRateInput('');
    }
  }, [currentRate, isLoading, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(rateInput);
    if (Number.isNaN(num) || num <= 0) {
      addToast('Please enter a valid positive number for the rate.', 'error');
      return;
    }
    try {
      await updateFxRateMutation.mutateAsync(num);
      addToast('Exchange rate updated. It will be used for Paystack (USD → GHS).', 'success');
      setTouched(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update rate', 'error');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure app-wide settings such as the USD → GHS exchange rate for payments.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Exchange rate (USD → GHS)</CardTitle>
          <CardDescription>
            This rate is used when converting USD amounts to GHS for Paystack. If not set, the
            server uses the env variable FX_STATIC_USD_TO_GHS or fetches a live rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fx-rate">Rate (1 USD = ? GHS)</Label>
                <Input
                  id="fx-rate"
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 15.25"
                  value={rateInput}
                  onChange={(e) => {
                    setRateInput(e.target.value);
                    setTouched(true);
                  }}
                  className="max-w-xs"
                />
                {currentRate == null && !rateInput && (
                  <p className="text-sm text-muted-foreground">
                    No rate set in dashboard. Enter a value to override env/live rate.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={updateFxRateMutation.isPending || !rateInput.trim()}
              >
                {updateFxRateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save rate'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
