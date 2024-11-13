import type { TableData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { get } from "@core/utils";

const queryKey = "tables";

export default function useQueryTables(interval?: number): UseQueryResult<TableData[] | undefined> {
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => get<TableData[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query: UseQueryResult) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}