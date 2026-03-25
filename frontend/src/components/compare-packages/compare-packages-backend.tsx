'use client';

import ComponentLayout from '@/components/component-layout';
import {
  Bed,
  BedDouble,
  ChevronDown,
  Clock,
  Compass,
  Gift,
  HelpCircle,
  MapPin,
  Ticket,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePackages } from '@/hooks/queries/usePackages';
import { comparePackageOptions } from '@/services/packageComparisonService';
import type {
  ComparePackageOptionsQuery,
  PackageComparisonResponse,
  PackageComparisonTier,
  BookingPackage,
} from '@/types/booking';
import { HostelRoomBg, HotelRoomBg } from '@/assets/img';
import { cn } from '@/lib/utils';

const formatUsd = (amount: number): string =>
  `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getPackageCode = (pkg: BookingPackage): string | null => {
  if (typeof pkg.type === 'string') return pkg.type;
  return pkg.type.code;
};

const DEFAULT_FOUR_STAR_ROWS = [
  {
    title: 'Upscale Luxury',
    description:
      'Luxury 4-Star accommodation with enhanced comfort and premium modern amenities.',
  },
  {
    title: '15 Min to Venue',
    description:
      'Unbeatable proximity to match venues, saving you valuable time on game day.',
  },
  {
    title: '24hr Room Service',
    description:
      'Dedicated lifestyle manager for restaurant bookings, city tours, and personal errands.',
  },
  {
    title: 'Prime City Access',
    description: "Direct access to major shopping, high-end dining, and Qatar's historic sites.",
  },
  {
    title: 'Official Merchandise Kit',
    description:
      'Premium collection including official jersey, leather scarf, and match-ball replica.',
  },
];

const DEFAULT_THREE_STAR_ROWS = [
  {
    title: 'Standard Comfort',
    description:
      'Daily premium buffet breakfast to start your match day with localized delicacies.',
  },
  {
    title: '35 Min to Venue',
    description:
      'Reliable transport with a standard commute time to the tournament stadium.',
  },
  {
    title: '24hr Room Service',
    description:
      'Centralized digital support desk for logistics and tournament-related queries',
  },
  {
    title: 'Strategic Location',
    description:
      'Conveniently located with easy public transit links to the city center.',
  },
  {
    title: 'Commemorative Pin',
    description:
      'Limited edition tournament lapel pin and official welcome lanyard.',
  },
];

type LandingCompareSide = {
  label: string;
  price: number;
  roomLabel?: string;
  cityCount?: number;
  duration?: string;
  imageUrl?: string;
};

type LandingCompareRow = {
  lineKey: string;
  left: { title: string; description?: string };
  right: { title: string; description?: string };
};

const getIconByLineKey = (lineKey: string, tier: PackageComparisonTier) => {
  const normalizedKey = lineKey.trim().toLowerCase();
  if (normalizedKey === 'accommodation' || normalizedKey === 'row_1') {
    return tier === 'four_star' ? BedDouble : Bed;
  }
  if (normalizedKey === 'proximity' || normalizedKey === 'row_2') {
    return Clock;
  }
  if (normalizedKey === 'support' || normalizedKey === 'row_3') {
    return tier === 'four_star' ? UserRound : HelpCircle;
  }
  if (normalizedKey === 'location' || normalizedKey === 'row_4') {
    return tier === 'four_star' ? Compass : MapPin;
  }
  if (normalizedKey === 'gifts' || normalizedKey === 'row_5') {
    return tier === 'four_star' ? Gift : Ticket;
  }
  return null;
};

const getTierIconColor = (tier: PackageComparisonTier): string =>
  tier === 'four_star' ? 'text-[#006CE4]' : 'text-neutral-400';

const toTierLabel = (tier: PackageComparisonTier): string =>
  tier === 'four_star' ? '4 Star Hotel Package' : '3 Star Hotel Package';

const toTierDescriptionRows = (
  tier: PackageComparisonTier
): Array<{ title: string; description: string }> =>
  tier === 'four_star' ? DEFAULT_FOUR_STAR_ROWS : DEFAULT_THREE_STAR_ROWS;

export const ComparePackages = () => {
  const {
    data: packages = [],
    isLoading: packagesLoading,
    isError: packagesError,
  } = usePackages();

  const preferredPackage = useMemo(() => {
    if (packages.length === 0) return null;

    const doubleGame =
      packages.find((p) => getPackageCode(p) === 'double_game') ??
      packages.find((p) => {
        const code = (getPackageCode(p) ?? '').toLowerCase();
        return code.includes('double');
      });

    return doubleGame ?? packages[0];
  }, [packages]);

  const [leftPackageId, setLeftPackageId] = useState<string>('');
  const [rightPackageId, setRightPackageId] = useState<string>('');
  const [leftTier, setLeftTier] = useState<PackageComparisonTier>('four_star');
  const [rightTier, setRightTier] = useState<PackageComparisonTier>('three_star');
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preferredPackage?.id) return;
    setLeftPackageId((prev) => prev || preferredPackage.id);
    setRightPackageId((prev) => prev || preferredPackage.id);
  }, [preferredPackage?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leftRef.current && !leftRef.current.contains(event.target as Node)) {
        setIsLeftOpen(false);
      }
      if (rightRef.current && !rightRef.current.contains(event.target as Node)) {
        setIsRightOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const compareQuery: ComparePackageOptionsQuery | null = useMemo(() => {
    if (!leftPackageId || !rightPackageId) return null;
    return {
      leftPackageId,
      leftTier,
      rightPackageId,
      rightTier,
    };
  }, [leftPackageId, rightPackageId, leftTier, rightTier]);

  const comparisonQuery = useQuery<PackageComparisonResponse>({
    queryKey: ['package-comparison-landing', compareQuery],
    enabled: compareQuery != null && !packagesLoading && !packagesError,
    queryFn: () => comparePackageOptions(compareQuery as ComparePackageOptionsQuery),
  });

  const left = comparisonQuery.data?.left ?? null;
  const right = comparisonQuery.data?.right ?? null;
  const leftPkg = packages.find((pkg) => pkg.id === leftPackageId);
  const rightPkg = packages.find((pkg) => pkg.id === rightPackageId);
  const leftPkgName = packages.find((pkg) => pkg.id === leftPackageId)?.name ?? 'Select package';
  const rightPkgName = packages.find((pkg) => pkg.id === rightPackageId)?.name ?? 'Select package';

  const hasBackendComparison = Boolean(comparisonQuery.data && left && right);

  const fallbackLeft: LandingCompareSide | null = leftPkg
    ? {
        label: toTierLabel(leftTier),
        price: leftTier === 'four_star' ? leftPkg.hotelPrice : leftPkg.hostelPrice,
        roomLabel: 'Double Occupancy',
        cityCount: leftPkg.cityCount ?? 0,
        duration: leftPkg.duration,
        imageUrl: leftTier === 'four_star' ? HotelRoomBg.src : HostelRoomBg.src,
      }
    : null;

  const fallbackRight: LandingCompareSide | null = rightPkg
    ? {
        label: toTierLabel(rightTier),
        price: rightTier === 'four_star' ? rightPkg.hotelPrice : rightPkg.hostelPrice,
        roomLabel: 'Double Occupancy',
        cityCount: rightPkg.cityCount ?? 0,
        duration: rightPkg.duration,
        imageUrl: rightTier === 'four_star' ? HotelRoomBg.src : HostelRoomBg.src,
      }
    : null;

  const fallbackRows: LandingCompareRow[] = useMemo(() => {
    const leftRows = toTierDescriptionRows(leftTier);
    const rightRows = toTierDescriptionRows(rightTier);
    const maxRows = Math.max(leftRows.length, rightRows.length);
    return Array.from({ length: maxRows }, (_, index) => ({
      lineKey: `row_${index + 1}`,
      left: {
        title: leftRows[index]?.title ?? '—',
        description: leftRows[index]?.description,
      },
      right: {
        title: rightRows[index]?.title ?? '—',
        description: rightRows[index]?.description,
      },
    }));
  }, [leftTier, rightTier]);

  const uiLeft: LandingCompareSide | null = hasBackendComparison
    ? {
        label: left!.label,
        price: left!.price,
        roomLabel: left!.roomLabel,
        cityCount: left!.cityCount,
        duration: left!.duration,
        imageUrl: left!.imageUrl ?? undefined,
      }
    : fallbackLeft;

  const uiRight: LandingCompareSide | null = hasBackendComparison
    ? {
        label: right!.label,
        price: right!.price,
        roomLabel: right!.roomLabel,
        cityCount: right!.cityCount,
        duration: right!.duration,
        imageUrl: right!.imageUrl ?? undefined,
      }
    : fallbackRight;

  const uiRows: LandingCompareRow[] = hasBackendComparison
    ? comparisonQuery.data!.comparisonRows.map((row) => ({
        lineKey: row.lineKey,
        left: {
          title: row.left?.title ?? '—',
          description: row.left?.description,
        },
        right: {
          title: row.right?.title ?? '—',
          description: row.right?.description,
        },
      }))
    : fallbackRows;

  const leftImageSrc = uiLeft?.imageUrl ?? HotelRoomBg.src;
  const rightImageSrc = uiRight?.imageUrl ?? HostelRoomBg.src;

  return (
    <ComponentLayout className="pb-8">
      <div className="mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6 text-center">
          <h2 className="text-[30px] md:text-[30px] lg:text-[40px] font-medium text-[#2A2A2A] font-clash">
            Compare Packages
          </h2>
          <p className="text-sm md:text-lg lg:text-[20px] font-normal text-[#2A2A2A] font-helvetica leading-relaxed">
            Whether you're attending one iconic match or doubling the excitement with two unforgettable games, our hosting packages combine football, travel, and premium fan experiences into one seamless trip.
          </p>
        </div>

        {/* Selection Controls */}
        {!packagesLoading && !packagesError && packages.length > 0 ? (
          <div className="mb-10 w-full">
            <div className="flex flex-row items-center gap-2 md:gap-8 w-full">
              <div className="flex-1 w-full relative" ref={leftRef}>
                <button
                  onClick={() => setIsLeftOpen((prev) => !prev)}
                  className="w-full flex items-center justify-center px-2 md:px-4 py-3 border border-neutral-200 rounded-md text-[#A42100] font-clash font-semibold text-xs md:text-xl shadow-sm tracking-wider hover:border-[#A42100]/30 transition-colors bg-white z-10"
                >
                  {leftPkgName} ({leftTier === 'four_star' ? '4 Star' : '3 Star'})
                  <ChevronDown
                    className={cn(
                      'size-4 md:size-6 ml-1 md:ml-2 transition-transform',
                      isLeftOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isLeftOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-neutral-200 rounded-md shadow-xl z-50 overflow-hidden">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="border-b border-neutral-100 last:border-b-0">
                        <button
                          onClick={() => {
                            setLeftPackageId(pkg.id);
                            setLeftTier('four_star');
                            setIsLeftOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors text-neutral-600"
                        >
                          {pkg.name} (4 Star)
                        </button>
                        <button
                          onClick={() => {
                            setLeftPackageId(pkg.id);
                            setLeftTier('three_star');
                            setIsLeftOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors text-neutral-600"
                        >
                          {pkg.name} (3 Star)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-xl md:text-3xl font-clash text-neutral-800">VS</span>

              <div className="flex-1 w-full relative" ref={rightRef}>
                <button
                  onClick={() => setIsRightOpen((prev) => !prev)}
                  className="w-full flex items-center justify-center px-2 md:px-4 py-3 border border-neutral-200 rounded-md text-[#A42100] font-clash font-semibold text-xs md:text-xl shadow-sm tracking-wider hover:border-[#A42100]/30 transition-colors bg-white z-10"
                >
                  {rightPkgName} ({rightTier === 'four_star' ? '4 Star' : '3 Star'})
                  <ChevronDown
                    className={cn(
                      'size-4 md:size-6 ml-1 md:ml-2 transition-transform',
                      isRightOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isRightOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-neutral-200 rounded-md shadow-xl z-50 overflow-hidden">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="border-b border-neutral-100 last:border-b-0">
                        <button
                          onClick={() => {
                            setRightPackageId(pkg.id);
                            setRightTier('four_star');
                            setIsRightOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors text-neutral-600"
                        >
                          {pkg.name} (4 Star)
                        </button>
                        <button
                          onClick={() => {
                            setRightPackageId(pkg.id);
                            setRightTier('three_star');
                            setIsRightOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors text-neutral-600"
                        >
                          {pkg.name} (3 Star)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {packagesLoading ? (
          <div className="w-full py-16 text-center font-helvetica text-neutral-500">
            Loading comparison…
          </div>
        ) : packagesError ? (
          <div className="w-full py-16 text-center font-helvetica text-neutral-500">
            Failed to load packages for comparison.
          </div>
        ) : comparisonQuery.isLoading ? (
          <div className="w-full py-16 text-center font-helvetica text-neutral-500">
            Loading comparison details…
          </div>
        ) : !uiLeft || !uiRight ? (
          <div className="w-full py-16 text-center font-helvetica text-neutral-500">
            Comparison is unavailable right now.
          </div>
        ) : (
          <>
            {/* Comparison Grid (Images) */}
            <div className="grid grid-cols-2 gap-4 md:gap-20 w-full">
              <div className="flex flex-col items-center text-center">
                <div className="relative aspect-5/3 w-full mb-6 overflow-hidden rounded-bl-[20px] md:rounded-bl-[40px] shadow-lg bg-neutral-100">
                  <img
                    src={leftImageSrc}
                    alt={uiLeft.label}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                  />
                </div>
                <div className="mb-2">
                  <div className="text-2xl md:text-4xl font-black text-primary-300">
                    {formatUsd(uiLeft.price)}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 font-helvetica mt-1">
                    {uiLeft.roomLabel ?? `${uiLeft.cityCount ?? 0} cities`} • {uiLeft.duration ?? '—'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative aspect-5/3 w-full mb-6 overflow-hidden shadow-lg bg-neutral-100">
                  <img
                    src={rightImageSrc}
                    alt={uiRight.label}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                  />
                </div>
                <div className="mb-2">
                  <div className="text-2xl md:text-4xl font-black text-primary-300">
                    {formatUsd(uiRight.price)}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 font-helvetica mt-1">
                    {uiRight.roomLabel ?? `${uiRight.cityCount ?? 0} cities`} • {uiRight.duration ?? '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table Rows */}
            <div className="w-full space-y-0">
              {uiRows.map((row) => (
                <div
                  key={row.lineKey}
                  className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden"
                >
                  <div className="mx-auto px-4 md:px-8 py-6">
                    <div className="grid grid-cols-2 gap-4 md:gap-32 w-full">
                      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                        {(() => {
                          const Icon = getIconByLineKey(row.lineKey, leftTier);
                          return Icon ? (
                            <Icon
                              className={cn('size-6 md:size-8 mb-2', getTierIconColor(leftTier))}
                              strokeWidth={2.5}
                            />
                          ) : null;
                        })()}
                        <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                          {row.left.title}
                        </h4>
                        {row.left.description ? (
                          <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                            {row.left.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                        {(() => {
                          const Icon = getIconByLineKey(row.lineKey, rightTier);
                          return Icon ? (
                            <Icon
                              className={cn('size-6 md:size-8 mb-2', getTierIconColor(rightTier))}
                              strokeWidth={2.5}
                            />
                          ) : null;
                        })()}
                        <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                          {row.right.title}
                        </h4>
                        {row.right.description ? (
                          <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                            {row.right.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <hr className="border-neutral-200 mt-4 pb-4 max-w-5xl mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Booking Buttons Footer */}
        <div className="w-full max-w-6xl grid grid-cols-2 gap-4 md:gap-24 px-4 mt-8">
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-1 md:gap-3 px-2 md:px-8 py-3 border border-neutral-200 rounded-md text-primary-300 font-bold text-sm md:text-lg hover:bg-neutral-50 transition-colors w-full">
              Book Stay <Bed className="size-4 md:size-7" />
            </button>
          </div>
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-1 md:gap-3 px-2 md:px-8 py-3 border border-neutral-200 rounded-md text-primary-300 font-bold text-sm md:text-lg hover:bg-neutral-50 transition-colors w-full">
              Book Stay <Bed className="size-4 md:size-7" />
            </button>
          </div>
        </div>
      </div>
    </ComponentLayout>
  );
};

