import type { UserData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "users";

export default function useQueryEmployees(interval?: number): UseQueryResult<(UserData)[] | undefined> {

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<UserData[]>(queryKey, { params: { "registered": true } }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}