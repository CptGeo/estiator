import { useEffect, useState } from "react";
import { client } from "../core/request";
import { ReservationData } from "../core/types";
import { HttpStatusCode } from "axios";
import { equals } from "../core/utils";

/**
 * @todo Implement such hooks using TanStack Query
 */
export default function useGetReservations(): ReservationData[] | null {
  const [ data, setData ] = useState<ReservationData[] | null>(null);

  useEffect(() => {
    async function getReservations(): Promise<void> {
      try {
        const response = await client.get("reservations");
        if (response.status == HttpStatusCode.Ok) {
          if (!equals(response.data, data)) {
            setData(response.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const i = setInterval(getReservations, 2000);
    return () => {
      clearInterval(i);
    }
  }, []);

  return data;
}