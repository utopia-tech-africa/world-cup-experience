import { useMutation } from "@tanstack/react-query";
import type { ComparePackageOptionsQuery } from "@/types/booking";
import { comparePackageOptions } from "@/services/packageComparisonService";

export const useComparePackageOptions = () => {
  return useMutation({
    mutationFn: (query: ComparePackageOptionsQuery) => comparePackageOptions(query),
  });
};

