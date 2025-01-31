import type { ReservationData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "reservations";

type Params = {
  /** Will get the number of reservations; Extra params `dateTo` and `dateFrom` can be used to get reservations for specific date range */
  count?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export default function useQueryReservations<T = ReservationData[]>(interval?: number, params?: Params): UseQueryResult<T | undefined> {
  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => getReq<T>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}