import type { SettingsData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

type Params = Record<string, unknown>;

export default function useQuerySettings<T = SettingsData>(interval?: number, options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">, params?: Params): UseQueryResult<T | undefined> {

  const queryKey = `settings`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<T>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}