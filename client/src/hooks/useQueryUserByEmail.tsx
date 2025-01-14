import type { UserData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryUserByEmail(email: string | undefined, options?: Omit<UseQueryOptions<UserData>, "queryKey" | "queryFn">): UseQueryResult<UserData | undefined, Error> {

  const queryKey = `users/email/${email}`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<UserData>(queryKey) as unknown as UserData,
  });

  return query;
}