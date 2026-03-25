import axios from "@/lib/axios";
import type {
  ComparePackageOptionsQuery,
  PackageComparisonResponse,
} from "@/types/booking";

export const comparePackageOptions = async (
  query: ComparePackageOptionsQuery,
): Promise<PackageComparisonResponse> => {
  const { data } = await axios.get<PackageComparisonResponse>(
    "/packages/comparison",
    {
      params: query,
    },
  );

  return data;
};

