'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
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
import { useToast } from '@/components/ui/toast';
import { Upload, Loader2, FileSpreadsheet, Download } from 'lucide-react';
import { usePackages } from '@/hooks/queries/usePackages';
import { useAddons } from '@/hooks/queries/useAddons';
import { getBasePackagePrice } from '@/lib/booking-pricing';
import { createBulkBookings, type BulkBookingRow } from '@/services/adminService';
import { useQueryClient } from '@tanstack/react-query';

type RowRecord = Record<string, string | number>;

function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseDate(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parts = trimmed.split(/[/-]/);
    if (parts.length === 3) {
      const [a, b, c] = parts;
      const year = (c?.length === 4 ? c : `20${c}`) ?? '';
      const month = (b?.padStart(2, '0')) ?? '01';
      const day = (a?.padStart(2, '0')) ?? '01';
      return `${year}-${month}-${day}`;
    }
  }
  if (typeof value === 'number' && value > 0) {
    const d = XLSX.SSF.parse_date_code(value);
    if (d) {
      const y = d.y;
      const m = String(d.m).padStart(2, '0');
      const day = String(d.d).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
  return '';
}

function normalizePackageType(v: string): string {
  const s = String(v).trim().toLowerCase();
  if (s.includes('double') || s === 'double_game') return 'double_game';
  return 'single_game';
}

function normalizeAccommodation(v: string): 'hotel' | 'hostel' {
  const s = String(v).trim().toLowerCase();
  if (s === 'hostel') return 'hostel';
  return 'hotel';
}

function normalizePaymentAccount(v: string): 'local' | 'international' {
  const s = String(v).trim().toLowerCase();
  if (s === 'international') return 'international';
  return 'local';
}

const SAMPLE_HEADERS = [
  'Full Name',
  'Email',
  'Phone',
  'Passport Number',
  'Passport Expiry',
  'Package Type',
  'Accommodation',
  'Number of Travelers',
  'Special Requests',
  'Payment Account',
  'Extra 1 First Name',
  'Extra 1 Last Name',
  'Extra 1 Passport Number',
  'Extra 1 Passport Expiry',
  'Extra 2 First Name',
  'Extra 2 Last Name',
  'Extra 2 Passport Number',
  'Extra 2 Passport Expiry',
  'Addon 1 Name',
  'Addon 1 Qty',
  'Addon 2 Name',
  'Addon 2 Qty',
  'Addon 3 Name',
  'Addon 3 Qty',
];

const SAMPLE_ROW_1 = [
  'Jane Doe',
  'jane@example.com',
  '+1234567890',
  'AB1234567',
  '2027-12-31',
  'One Game',
  'hotel',
  '1',
  '',
  'local',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

const SAMPLE_ROW_2 = [
  'John Smith',
  'john@example.com',
  '+1987654321',
  'CD9876543',
  '2028-06-15',
  'Double Game',
  'hostel',
  '2',
  'Vegetarian meals',
  'international',
  'Alice Smith',
  'Smith',
  'EF1111111',
  '2028-01-20',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

function downloadSampleTemplate() {
  const wsData = [SAMPLE_HEADERS, SAMPLE_ROW_1, SAMPLE_ROW_2];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
  XLSX.writeFile(wb, 'bulk-booking-template.xlsx');
}

const EXTRA_TRAVELER_KEYS = [
  'extra 1 first name',
  'extra 1 last name',
  'extra 1 passport number',
  'extra 1 passport expiry',
  'extra 2 first name',
  'extra 2 last name',
  'extra 2 passport number',
  'extra 2 passport expiry',
  'extra 3 first name',
  'extra 3 last name',
  'extra 3 passport number',
  'extra 3 passport expiry',
  'extra 4 first name',
  'extra 4 last name',
  'extra 4 passport number',
  'extra 4 passport expiry',
  'extra 5 first name',
  'extra 5 last name',
  'extra 5 passport number',
  'extra 5 passport expiry',
];

const ADDON_KEYS = [
  'addon 1 name',
  'addon 1 qty',
  'addon 2 name',
  'addon 2 qty',
  'addon 3 name',
  'addon 3 qty',
  'addon 4 name',
  'addon 4 qty',
  'addon 5 name',
  'addon 5 qty',
];

function buildKeyMap(json: RowRecord[], possibleHeaders: string[]): Record<string, string> {
  const keyMap: Record<string, string> = {};
  const sheetKeys = Object.keys(json[0] ?? {});

  // Primary: map each sheet column's normalized name to the exact column name.
  // This ensures the downloaded template (Full Name, Email, ...) matches.
  for (const col of sheetKeys) {
    const normalized = normalizeKey(col);
    if (normalized) keyMap[normalized] = col;
  }

  // Fallback: if a possible header wasn't found by exact normalize, try partial match.
  for (const p of possibleHeaders) {
    if (keyMap[p]) continue;
    const found = sheetKeys.find((k) => {
      const n = normalizeKey(k);
      return n === p || n.includes(p) || p.includes(n);
    });
    if (found) keyMap[p] = found;
  }

  // Extra traveler columns (exact normalized match).
  for (const p of EXTRA_TRAVELER_KEYS) {
    if (keyMap[p]) continue;
    const found = sheetKeys.find((k) => normalizeKey(k) === p);
    if (found) keyMap[p] = found;
  }

  // Addon columns (exact normalized match).
  for (const p of ADDON_KEYS) {
    if (keyMap[p]) continue;
    const found = sheetKeys.find((k) => normalizeKey(k) === p);
    if (found) keyMap[p] = found;
  }

  return keyMap;
}

export default function AdminBulkBookingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<BulkBookingRow[]>([]);
  const [defaultPaymentProofUrl, setDefaultPaymentProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data: packages = [] } = usePackages();
  const { data: apiAddons = [] } = useAddons();

  const packageNameByType = useCallback((type: string) => {
    return type === 'double_game' ? 'Double Game' : 'One Game';
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) {
        setFile(null);
        setPreviewRows([]);
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = ev.target?.result;
          if (!data) return;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]!];
          const json: RowRecord[] = XLSX.utils.sheet_to_json(firstSheet, {
            defval: '',
            raw: false,
          });
          if (json.length === 0) {
            setPreviewRows([]);
            addToast('No rows found in the sheet.', 'error');
            return;
          }
          const possibleHeaders = [
            'full name',
            'email',
            'phone',
            'passport number',
            'passport expiry',
            'package type',
            'accommodation',
            'number of travelers',
            'special requests',
            'payment account',
          ];
          const keyMap = buildKeyMap(json, possibleHeaders);

          const get = (row: RowRecord, key: string): string => {
            const col = keyMap[key];
            if (col == null) return '';
            const val = row[col];
            if (val == null) return '';
            return String(val).trim();
          };

          function parseExtraTravelers(row: RowRecord): BulkBookingRow['extraTravelers'] {
            const extra: NonNullable<BulkBookingRow['extraTravelers']> = [];
            for (let n = 1; n <= 5; n++) {
              const firstName = get(row, `extra ${n} first name`);
              const lastName = get(row, `extra ${n} last name`);
              const passportNumber = get(row, `extra ${n} passport number`);
              const passportExpiryRaw = row[keyMap[`extra ${n} passport expiry`] ?? ''] ?? get(row, `extra ${n} passport expiry`);
              const passportExpiry = parseDate(passportExpiryRaw);
              if (firstName && lastName && passportNumber && passportExpiry) {
                extra.push({ firstName, lastName, passportNumber, passportExpiry });
              }
            }
            return extra.length ? extra : undefined;
          }

          function parseAddons(row: RowRecord): { addons: BulkBookingRow['addons']; addonsTotalPrice: number } {
            const addons: BulkBookingRow['addons'] = [];
            let addonsTotalPrice = 0;
            for (let n = 1; n <= 5; n++) {
              const name = get(row, `addon ${n} name`);
              const qtyStr = get(row, `addon ${n} qty`);
              if (!name) continue;
              const qty = Math.max(1, parseInt(qtyStr || '1', 10) || 1);
              const addon = apiAddons.find(
                (a: { name: string }) => a.name.trim().toLowerCase() === name.trim().toLowerCase()
              );
              if (addon) {
                const price = Number(addon.price);
                addons.push({ id: addon.id, quantity: qty, price });
                addonsTotalPrice += price * qty;
              }
            }
            return { addons, addonsTotalPrice };
          }

          const rows: BulkBookingRow[] = [];
          for (let i = 0; i < json.length; i++) {
            const row = json[i] as RowRecord;
            const fullName = get(row, 'full name');
            const email = get(row, 'email');
            const phone = get(row, 'phone');
            const passportNumber = get(row, 'passport number');
            const passportExpiryRaw = row[keyMap['passport expiry'] ?? ''] ?? get(row, 'passport expiry');
            const passportExpiry = parseDate(passportExpiryRaw);
            if (!fullName || !email || !phone || !passportNumber || !passportExpiry) continue;
            const packageType = normalizePackageType(get(row, 'package type'));
            const accommodationType = normalizeAccommodation(get(row, 'accommodation'));
            const extraTravelers = parseExtraTravelers(row);
            const numFromExtras = 1 + (extraTravelers?.length ?? 0);
            const numFromColumn = Math.min(10, Math.max(1, parseInt(get(row, 'number of travelers') || '1', 10) || 1));
            const numTravelers = extraTravelers?.length
              ? numFromExtras
              : Math.max(numFromExtras, numFromColumn);
            const packageName = packageNameByType(packageType);
            const basePackagePrice = getBasePackagePrice(packageName, accommodationType, packages);
            const { addons, addonsTotalPrice } = parseAddons(row);
            const totalAmount = basePackagePrice * numTravelers + addonsTotalPrice;
            rows.push({
              fullName,
              email,
              phone,
              passportNumber,
              passportExpiry,
              packageType,
              accommodationType,
              numberOfTravelers: numTravelers,
              extraTravelers,
              specialRequests: get(row, 'special requests') || undefined,
              paymentAccountType: normalizePaymentAccount(get(row, 'payment account')),
              basePackagePrice,
              addonsTotalPrice,
              totalAmount,
              addons,
            });
          }
          setPreviewRows(rows);
          if (rows.length === 0) {
            addToast('No valid rows (need Full Name, Email, Phone, Passport Number, Passport Expiry).', 'error');
          }
        } catch (err) {
          addToast(err instanceof Error ? err.message : 'Failed to parse Excel', 'error');
          setPreviewRows([]);
        }
      };
      reader.readAsBinaryString(f);
    },
    [addToast, packageNameByType, packages, apiAddons]
  );

  const handleSubmit = async () => {
    if (previewRows.length === 0) {
      addToast('Import an Excel file with at least one valid row first.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createBulkBookings({
        bookings: previewRows,
        defaultPaymentProofUrl: defaultPaymentProofUrl.trim() || undefined,
      });
      addToast(
        `Created ${result.created} booking(s).${result.failed > 0 ? ` ${result.failed} failed.` : ''}`,
        result.failed > 0 ? 'warning' : 'success'
      );
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      if (result.created > 0) {
        setFile(null);
        setPreviewRows([]);
        const input = document.getElementById('bulk-excel-input') as HTMLInputElement;
        if (input) input.value = '';
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : null;
      addToast(message || (err instanceof Error ? err.message : 'Bulk booking failed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bulk booking</h1>
        <p className="text-muted-foreground mt-1">
          Import an Excel file to create multiple bookings at once.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Excel</CardTitle>
          <CardDescription>
            Upload a .xlsx file. First row must be headers. Use the sample template to get the correct columns. Supported: Full Name, Email, Phone, Passport Number, Passport Expiry, Package Type (One Game / Double Game), Accommodation (hotel / hostel), Number of Travelers (default 1), Special Requests, Payment Account (local / international). For extra passengers use Extra 1–5 First/Last Name, Passport Number, Passport Expiry. For add-ons use Addon 1–3 Name and Addon 1–3 Qty (addon name must match an add-on in the system).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={downloadSampleTemplate} className="gap-2">
              <Download className="size-4" />
              Download sample template
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bulk-excel-input">Excel file</Label>
            <div className="flex items-center gap-3">
              <Input
                id="bulk-excel-input"
                type="file"
                accept=".xlsx,.xls"
                className="max-w-sm"
                onChange={handleFileChange}
              />
              {file && (
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <FileSpreadsheet className="size-4" />
                  {file.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="default-payment-proof">Default payment proof URL (optional)</Label>
            <Input
              id="default-payment-proof"
              type="url"
              placeholder="https://..."
              value={defaultPaymentProofUrl}
              onChange={(e) => setDefaultPaymentProofUrl(e.target.value)}
              className="max-w-md"
            />
            <p className="text-muted-foreground text-xs">
              Used for all rows that do not have a payment proof URL. Leave empty to use a placeholder.
            </p>
          </div>
          {previewRows.length > 0 && (
            <>
              <div className="rounded-md border">
                <div className="max-h-60 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted">
                      <tr className="border-b">
                        <th className="px-3 py-2 text-left font-medium">#</th>
                        <th className="px-3 py-2 text-left font-medium">Full Name</th>
                        <th className="px-3 py-2 text-left font-medium">Email</th>
                        <th className="px-3 py-2 text-left font-medium">Package</th>
                        <th className="px-3 py-2 text-left font-medium">Accommodation</th>
                        <th className="px-3 py-2 text-left font-medium">Travelers</th>
                        <th className="px-3 py-2 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.slice(0, 20).map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-3 py-2">{i + 1}</td>
                          <td className="px-3 py-2">{row.fullName}</td>
                          <td className="px-3 py-2">{row.email}</td>
                          <td className="px-3 py-2">{row.packageType.replace('_', ' ')}</td>
                          <td className="px-3 py-2">{row.accommodationType}</td>
                          <td className="px-3 py-2">{row.numberOfTravelers}</td>
                          <td className="px-3 py-2 text-right tabular-nums">${row.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewRows.length > 20 && (
                  <p className="text-muted-foreground px-3 py-2 text-xs border-t">
                    Showing first 20 of {previewRows.length} rows.
                  </p>
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Create {previewRows.length} booking(s)
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
