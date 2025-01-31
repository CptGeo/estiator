import type { TableData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "tables";

type Params = {
  count?: boolean;
  capacity?: boolean;
}

export default function useQueryTables<T = TableData[]>(interval?: number, params?: Params): UseQueryResult<T | undefined> {
  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => getReq<T>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}