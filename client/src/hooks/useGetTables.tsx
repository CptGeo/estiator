import { useEffect, useState } from "react";
import { client } from "../core/request";
import { TableData } from "../core/types";
import { HttpStatusCode } from "axios";
import equals from "../core/utils";

type Return<T> = {
  data: T;
  loading: boolean;
}

export default function useGetTables(): Return<TableData[] | null> {
  const [ data, setData ] = useState<TableData[] | null>(null);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    async function getTables(): Promise<void> {
      try {
        const response = await client.get("tables");
        if (response.status == HttpStatusCode.Ok) {
          if(!equals(response.data, data)) {
            setData(response.data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const i = setInterval(getTables, 2000);
    return () => {
      clearInterval(i);
    }
  }, [data]);

  return { data, loading };
}