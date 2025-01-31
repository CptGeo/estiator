import type { TableData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";
import type { AxiosRequestConfig } from "axios";

const queryKey = "tables";

export default function useQueryTables<T = TableData[]>(interval?: number, params?: AxiosRequestConfig): UseQueryResult<T | undefined> {
  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => getReq<T>(queryKey, params),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}