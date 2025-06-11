import type { TableData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";
import type { CalendarDate } from "@internationalized/date";

const queryKey = "tables";

type Params = {
  count?: boolean;
  capacity?: boolean;

  date?: CalendarDate;

  /** @format HH:mm */
  time?: string;

  /** @format in seconds */
  duration?: number;
}

export default function useQueryTables<T = TableData[]>(interval?: number, options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">, params?: Params): UseQueryResult<T | undefined> {
  const query = useQuery({
    ...options,
    queryKey: [queryKey, params],
    queryFn: () => getReq<T>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval,
  });

  return query;
}