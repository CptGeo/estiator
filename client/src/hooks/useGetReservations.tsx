import { useEffect, useState } from "react";
import { client } from "../core/request";
import { ReservationData } from "../core/types";
import { HttpStatusCode } from "axios";
import { equals } from "../core/utils";

type Return<T> = {
  data: T;
  loading: boolean;
}

export default function useGetReservations(): Return<ReservationData[] | null> {
  const [ data, setData ] = useState<ReservationData[] | null>(null);
  const [ loading, setLoading ] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    const i = setInterval(getReservations, 2000);
    return () => {
      clearInterval(i);
    }
  }, []);

  return { data, loading };
}