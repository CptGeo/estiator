import type { ReservationData } from "@core/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { get } from "@core/utils";

const queryKey = "reservations";

export default function useQueryReservations(interval?: number): UseQueryResult<ReservationData[] | undefined> {
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => get<ReservationData[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query: UseQueryResult) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}