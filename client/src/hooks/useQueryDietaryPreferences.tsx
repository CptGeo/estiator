import type { DietaryPreference } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryDietaryPreferences(interval?: number, options?: Omit<UseQueryOptions<DietaryPreference[]>, "queryKey" | "queryFn">): UseQueryResult<DietaryPreference[] | undefined> {

  const queryKey = `dietaryPreferences`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<DietaryPreference[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval,
  });

  return query;
}