import { client } from "@core/request";
import type { ReservationData } from "@core/types";
import { HttpStatusCode } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";


export default function useQueryReservations(interval?: number): UseQueryResult<ReservationData[] | undefined> {
  const query = useQuery({
      queryKey: ["reservations"],
      queryFn: getReservations,
      refetchInterval: interval
    });


  async function getReservations<T extends ReservationData[]>(): Promise<T | undefined> {
    const response = await client.get<T>("reservations");
    if (response.status == HttpStatusCode.Ok) {
      return response.data;
    }
    throw new Error("No data");
  };

  return query;
}