import type { UserData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

type Params = Record<string, unknown>;

export default function useQueryUser(id: string | undefined, params?: Params, interval?: number): UseQueryResult<UserData | undefined> {

  const queryKey = `users/${id}`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<UserData>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}