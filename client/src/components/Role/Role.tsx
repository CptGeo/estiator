import type { Color } from "@core/types";
import { Role } from "@core/types";
import { Chip } from "@heroui/react";

export default function RoleChip(props: { role?: Role }) {
  const role = props.role;

   const Color: Record<Role, Color> = {
    [Role.MANAGER]: "default",
    [Role.EMPLOYEE]: "primary"
  }

  return role && <Chip color={Color[role]}>{role}</Chip>;
}