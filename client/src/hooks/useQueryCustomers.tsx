import { UserRole, type UserData } from "@core/types";
import type { UseQueryResult } from "@tanstack/react-query";
import useQueryUsersByRole from "./useQueryUsers";

export default function useQueryCustomers(interval?: number): UseQueryResult<(UserData)[] | undefined> {
  const roles = [UserRole.CLIENT, UserRole.GUEST];

  return useQueryUsersByRole(roles, interval);
}