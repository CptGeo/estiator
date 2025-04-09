import type { UserData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryMe(interval?: number, options?: Omit<UseQueryOptions<UserData>, "queryKey" | "queryFn">): UseQueryResult<UserData | undefined> {

  const queryKey = `users/me`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<UserData>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval,
  });

  return query;
}