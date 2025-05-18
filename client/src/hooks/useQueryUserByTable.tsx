import type { Key, UserData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryUserByTable(tableId: Key, options?: Omit<UseQueryOptions<UserData>, "queryKey" | "queryFn">): UseQueryResult<UserData | undefined, Error> {

  const queryKey = `users/table/${tableId}`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<UserData>(queryKey) as unknown as UserData,
  });

  return query;
}