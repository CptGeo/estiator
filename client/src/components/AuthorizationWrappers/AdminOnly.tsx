import type { PropsWithChildren, ReactElement } from "react";
import PermissionGuard from "./PermissionGuard";
import { UserRole } from "@core/types";

export default function AdminOnly(props: PropsWithChildren): ReactElement | null {
    return <PermissionGuard permissions={[UserRole.ADMIN]}>
        {props.children}
    </PermissionGuard>
}