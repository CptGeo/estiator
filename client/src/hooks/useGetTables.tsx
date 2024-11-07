import { useEffect, useState } from "react";
import { client } from "@core/request";
import type { TableData } from "@core/types";
import { HttpStatusCode } from "axios";
import { equals } from "@core/utils";

/**
 * @todo Implement such hooks using TanStack Query
 */
export default function useGetTables(interval?: number): TableData[] | undefined | null {
  const [ data, setData ] = useState<TableData[] | null | undefined>(undefined);

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
        setData(null);
        console.error(error);
      }
    };

    getTables();

    if (interval) {
      const i = setInterval(getTables, interval);
      return () => {
        clearInterval(i);
      }
    }

  }, [data]);

  return data;
}