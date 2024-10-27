import { useCallback, useEffect, useState } from "react";
import { client } from "../core/request";
import { ReservationData } from "../core/types";
import { HttpStatusCode } from "axios";

type Return<T> = {
  data: T;
  loading: boolean;
}

export default function useGetReservations(): Return<ReservationData[] | null> {
  const [ data, setData ] = useState<ReservationData[] | null>(null);
  const [ loading, setLoading ] = useState(false);

  const getReservations = useCallback(async () => {
    try {
      const response = await client.get("reservation");
      if (response.status == HttpStatusCode.Ok) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const i = setInterval(getReservations, 2000);
    return () => {
      clearInterval(i);
    }
  }, []);

  return { data, loading };
}