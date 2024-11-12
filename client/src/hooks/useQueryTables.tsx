import type { TableData } from "@core/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
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