import type { Key, ReservationData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

const queryKey = "reservations/table/";

type Params = {
  dateFrom?: string;
  dateTo?: string;
  table?: Key | undefined;
}

export default function useQueryReservationsByTable<T = ReservationData[]>(id: Key | undefined, interval?: number, params?: Params): UseQueryResult<T | undefined> {
  const query = useQuery({
    queryKey: [`${queryKey}${id}`, params],
    queryFn: () => getReq<T>(`${queryKey}${id}`, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}