import { client } from "@core/request";
import type { TableData } from "@core/types";
import { HttpStatusCode } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export default function useQueryTables(interval?: number): UseQueryResult<TableData[] | undefined> {
  const query = useQuery({ 
    queryKey: ['tables'], 
    queryFn: getTables,
    // stop refetching after encountering error
    refetchInterval: ({state}) => state.fetchFailureCount > 0 ? false : interval
  });

  async function getTables<T extends TableData[]>(): Promise<T | undefined> {
    const response = await client.get<T>("tables");
    if (response.status == HttpStatusCode.Ok) {
      return response.data;
    }
    throw new Error("No data");
  };

  return query;
}