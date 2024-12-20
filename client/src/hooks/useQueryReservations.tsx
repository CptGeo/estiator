import type { ReservationData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "reservations";

export default function useQueryReservations(interval?: number): UseQueryResult<ReservationData[] | undefined> {
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<ReservationData[]>(queryKey),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}