import type { UserRole } from "@core/types";
import { type UserData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "users";

export default function useQueryUsersByRole(roles: UserRole[], interval?: number): UseQueryResult<(UserData)[] | undefined> {
  const query = useQuery({
    queryKey: [queryKey, ...roles],
    queryFn: () => getReq<UserData[]>(queryKey, { params: { "roles": roles.join(",") } }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}