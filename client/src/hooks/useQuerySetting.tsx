import type { SettingData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getReq } from "@core/utils";

type Params = Record<string, unknown>;

export default function useQuerySetting(id: string | undefined, params?: Params, interval?: number): UseQueryResult<SettingData | undefined> {

  const queryKey = `settings/${id}`;
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: () => getReq<SettingData>(queryKey, { params }),
    // stop refetching after encountering error
    refetchInterval: (query) => query.state.fetchFailureCount > 0 ? false : interval
  });

  return query;
}