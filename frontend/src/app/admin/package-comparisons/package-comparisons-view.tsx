'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { useAdminPackages } from '@/hooks/queries/useAdminPackages';
import { useUpdatePackage } from '@/hooks/mutations/useUpdatePackage';
import type { BookingPackage, PackageComparisonOption } from '@/types/booking';

function parseFeatureLines(text: string): Array<{ title: string; description?: string }> {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titlePart, ...rest] = line.split(' - ');
      const title = titlePart.trim();
      const description = rest.join(' - ').trim();
      return { title, description: description || undefined };
    });
}

function getTypeId(pkg: BookingPackage): string | undefined {
  if (pkg.typeId) return pkg.typeId;
  if (typeof pkg.type === 'object' && pkg.type && 'id' in pkg.type) return pkg.type.id;
  return undefined;
}

function packagesPageHref(packageIdForContext: string): string {
  return packageIdForContext
    ? `/admin/packages?packageId=${encodeURIComponent(packageIdForContext)}`
    : '/admin/packages';
}

export function PackageComparisonsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { data: packages = [], isLoading } = useAdminPackages();
  const updatePackageMutation = useUpdatePackage();

  const [packageId, setPackageId] = useState('');
  const [fourStarLabel, setFourStarLabel] = useState('4 Star Hotel Package');
  const [fourStarRoomLabel, setFourStarRoomLabel] = useState('Double Occupancy');
  const [fourStarImageUrl, setFourStarImageUrl] = useState('');
  const [fourStarCtaLabel, setFourStarCtaLabel] = useState('Book Stay');
  const [fourStarFeaturesText, setFourStarFeaturesText] = useState('');
  const [threeStarLabel, setThreeStarLabel] = useState('3 Star Hotel Package');
  const [threeStarRoomLabel, setThreeStarRoomLabel] = useState('Double Occupancy');
  const [threeStarImageUrl, setThreeStarImageUrl] = useState('');
  const [threeStarCtaLabel, setThreeStarCtaLabel] = useState('Book Stay');
  const [threeStarFeaturesText, setThreeStarFeaturesText] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  useEffect(() => {
    const idFromQuery = searchParams.get('packageId');
    if (!idFromQuery) return;
    setPackageId(idFromQuery);
  }, [searchParams]);

  useEffect(() => {
    if (packages.length === 0 || packageId) return;
    setPackageId(packages[0].id);
  }, [packages, packageId]);

  const selectedPackage = useMemo(
    () => packages.find((pkg) => pkg.id === packageId) ?? null,
    [packages, packageId]
  );

  useEffect(() => {
    if (!selectedPackage) return;
    const fourStar = selectedPackage.comparisonOptions?.find((option) => option.tier === 'four_star');
    const threeStar = selectedPackage.comparisonOptions?.find((option) => option.tier === 'three_star');

    setFourStarLabel(fourStar?.label ?? '4 Star Hotel Package');
    setFourStarRoomLabel(fourStar?.roomLabel ?? 'Double Occupancy');
    setFourStarImageUrl(fourStar?.imageUrl ?? '');
    setFourStarCtaLabel(fourStar?.ctaLabel ?? 'Book Stay');
    setFourStarFeaturesText(
      (fourStar?.features ?? [])
        .map((feature) => (feature.description ? `${feature.title} - ${feature.description}` : feature.title))
        .join('\n')
    );

    setThreeStarLabel(threeStar?.label ?? '3 Star Hotel Package');
    setThreeStarRoomLabel(threeStar?.roomLabel ?? 'Double Occupancy');
    setThreeStarImageUrl(threeStar?.imageUrl ?? '');
    setThreeStarCtaLabel(threeStar?.ctaLabel ?? 'Book Stay');
    setThreeStarFeaturesText(
      (threeStar?.features ?? [])
        .map((feature) => (feature.description ? `${feature.title} - ${feature.description}` : feature.title))
        .join('\n')
    );
  }, [selectedPackage]);

  const handleSave = async () => {
    if (!selectedPackage) return;
    const typeId = getTypeId(selectedPackage);
    if (!typeId) {
      addToast('Package type is missing for this package. Please edit package details first.', 'error');
      return;
    }

    const fourFeatures = parseFeatureLines(fourStarFeaturesText);
    const threeFeatures = parseFeatureLines(threeStarFeaturesText);
    const hasFeatures = fourFeatures.length > 0 || threeFeatures.length > 0;

    const comparisonOptions: PackageComparisonOption[] = hasFeatures
      ? [
          {
            tier: 'four_star',
            label: fourStarLabel.trim() || '4 Star Hotel Package',
            price: selectedPackage.hotelPrice,
            roomLabel: fourStarRoomLabel.trim() || undefined,
            imageUrl: fourStarImageUrl.trim() || undefined,
            ctaLabel: fourStarCtaLabel.trim() || undefined,
            displayOrder: 0,
            features: fourFeatures.map((feature, index) => ({
              lineKey: `row_${index + 1}`,
              title: feature.title,
              description: feature.description,
              displayOrder: index,
            })),
          },
          {
            tier: 'three_star',
            label: threeStarLabel.trim() || '3 Star Hotel Package',
            price: selectedPackage.hostelPrice,
            roomLabel: threeStarRoomLabel.trim() || undefined,
            imageUrl: threeStarImageUrl.trim() || undefined,
            ctaLabel: threeStarCtaLabel.trim() || undefined,
            displayOrder: 1,
            features: threeFeatures.map((feature, index) => ({
              lineKey: `row_${index + 1}`,
              title: feature.title,
              description: feature.description,
              displayOrder: index,
            })),
          },
        ]
      : [];

    try {
      await updatePackageMutation.mutateAsync({
        id: selectedPackage.id,
        input: {
          name: selectedPackage.name,
          typeId,
          startDate: selectedPackage.startDate ?? undefined,
          endDate: selectedPackage.endDate ?? undefined,
          hostelPrice: selectedPackage.hostelPrice,
          hotelPrice: selectedPackage.hotelPrice,
          cityCount: selectedPackage.cityCount ?? 0,
          includedItems: selectedPackage.includedItems ?? [],
          comparisonOptions,
          displayOrder: selectedPackage.displayOrder,
          isActive: selectedPackage.isActive,
          gameIds: selectedPackage.gameIds ?? [],
        },
      });
      addToast('Comparison details updated.', 'success');
      router.push(packagesPageHref(selectedPackage.id));
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      addToast(message || 'Failed to update comparison details', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Package Comparisons</h1>
          <p className="text-muted-foreground">
            Manage 3-star and 4-star comparison content in a separate section.
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-2" asChild>
          <Link href={packagesPageHref(packageId)}>
            <ArrowLeft className="size-4" />
            Back to packages
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select package</CardTitle>
          <CardDescription>Choose a package to edit its comparison details.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading packages...
            </div>
          ) : (
            <Select
              value={packageId || null}
              onValueChange={(value) => setPackageId(value ?? '')}
              items={packages.map((pkg) => ({ value: pkg.id, label: pkg.name }))}
            >
              <SelectTrigger className="w-full max-w-xl">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedPackage ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedPackage.name}</CardTitle>
            <CardDescription>
              Fill each side. Use one line per feature. Format: <code>Title - Optional description</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-md border p-3">
                <p className="text-sm font-medium">4-star</p>
                <Label htmlFor="comparison-four-label">Card label</Label>
                <Input id="comparison-four-label" value={fourStarLabel} onChange={(e) => setFourStarLabel(e.target.value)} />
                <Label htmlFor="comparison-four-room">Room label</Label>
                <Input id="comparison-four-room" value={fourStarRoomLabel} onChange={(e) => setFourStarRoomLabel(e.target.value)} />
                <Label htmlFor="comparison-four-image">Image URL</Label>
                <Input id="comparison-four-image" value={fourStarImageUrl} onChange={(e) => setFourStarImageUrl(e.target.value)} />
                <Label htmlFor="comparison-four-cta">CTA label</Label>
                <Input id="comparison-four-cta" value={fourStarCtaLabel} onChange={(e) => setFourStarCtaLabel(e.target.value)} />
                <Label htmlFor="comparison-four-features">Features (one per line)</Label>
                <textarea
                  id="comparison-four-features"
                  value={fourStarFeaturesText}
                  onChange={(e) => setFourStarFeaturesText(e.target.value)}
                  className="border-input bg-background min-h-40 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2 rounded-md border p-3">
                <p className="text-sm font-medium">3-star</p>
                <Label htmlFor="comparison-three-label">Card label</Label>
                <Input id="comparison-three-label" value={threeStarLabel} onChange={(e) => setThreeStarLabel(e.target.value)} />
                <Label htmlFor="comparison-three-room">Room label</Label>
                <Input id="comparison-three-room" value={threeStarRoomLabel} onChange={(e) => setThreeStarRoomLabel(e.target.value)} />
                <Label htmlFor="comparison-three-image">Image URL</Label>
                <Input id="comparison-three-image" value={threeStarImageUrl} onChange={(e) => setThreeStarImageUrl(e.target.value)} />
                <Label htmlFor="comparison-three-cta">CTA label</Label>
                <Input id="comparison-three-cta" value={threeStarCtaLabel} onChange={(e) => setThreeStarCtaLabel(e.target.value)} />
                <Label htmlFor="comparison-three-features">Features (one per line)</Label>
                <textarea
                  id="comparison-three-features"
                  value={threeStarFeaturesText}
                  onChange={(e) => setThreeStarFeaturesText(e.target.value)}
                  className="border-input bg-background min-h-40 w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={handleSave} disabled={updatePackageMutation.isPending}>
                {updatePackageMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Save comparison details'}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href={packagesPageHref(selectedPackage.id)}>Back to this package</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Select a package to start editing comparison details.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
