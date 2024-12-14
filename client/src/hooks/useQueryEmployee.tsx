import type { EmployeeData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryEmployee(id: string | undefined, interval?: number): UseQueryResult<EmployeeData | undefined> {

  const queryKey = `employees/${id}`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<EmployeeData>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}