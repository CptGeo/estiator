import type { Key, Schedule } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

type Params = Record<string, unknown>;

export default function useQueryUserSchedules(id: Key, params?: Params, interval?: number): UseQueryResult<Schedule[] | undefined> {

  const queryKey = `users/${id}/schedule`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<Schedule[]>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}