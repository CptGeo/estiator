import type { EmployeeData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { get } from "@core/utils";

const queryKey = "employees";

export default function useQueryEmployees(interval?: number): UseQueryResult<EmployeeData[] | undefined> {
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => get<EmployeeData[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}