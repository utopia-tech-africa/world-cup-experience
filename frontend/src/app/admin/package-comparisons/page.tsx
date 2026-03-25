import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { PackageComparisonsView } from './package-comparisons-view';

function PackageComparisonsFallback() {
  return (
    <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Loading…
    </div>
  );
}

export default function AdminPackageComparisonsPage() {
  return (
    <Suspense fallback={<PackageComparisonsFallback />}>
      <PackageComparisonsView />
    </Suspense>
  );
}
