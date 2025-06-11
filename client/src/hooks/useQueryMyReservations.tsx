import type { ReservationData } from "@core/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

export default function useQueryMyReservations(interval?: number, options?: Omit<UseQueryOptions<ReservationData[]>, "queryKey" | "queryFn">): UseQueryResult<ReservationData[] | undefined> {

  const queryKey = `reservations/me`;
  const query = useQuery({
    ...options,
    queryKey: [queryKey],
    queryFn: () => getReq<ReservationData[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval,
  });

  return query;
}