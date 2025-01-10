import type { Key, Schedule } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryUserScheduleByDate(id: Key, date: string, interval?: number): UseQueryResult<Schedule[] | undefined> {
  const queryKey = `users/${id}/schedule/${date}`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<Schedule[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}