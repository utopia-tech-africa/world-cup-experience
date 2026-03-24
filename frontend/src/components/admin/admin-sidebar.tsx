'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Box,
  Tags,
  Package,
  Columns3,
  Trophy,
  Users,
  LogOut,
  Upload,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/bulk-booking', label: 'Bulk booking', icon: Upload },
  { href: '/admin/addons', label: 'Add-ons', icon: Box },
  { href: '/admin/package-types', label: 'Game types', icon: Tags },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/package-comparisons', label: 'Package comparisons', icon: Columns3 },
  { href: '/admin/teams', label: 'Teams', icon: Users },
  { href: '/admin/games', label: 'Games', icon: Trophy },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

type AdminSidebarProps = {
  onLogout: () => void;
};

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-border bg-card">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <span className="font-semibold text-foreground">Admin</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="size-5 shrink-0" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
