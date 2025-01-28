import type { PropsWithChildren, ReactElement } from "react";
import PermissionGuard from "./PermissionGuard";
import { UserRole } from "@core/types";

type Props = PropsWithChildren<{fallback?: ReactElement}>;

export default function AdminOnly(props: Props): ReactElement | null {
    return <PermissionGuard permissions={[UserRole.ADMIN]} fallback={props.fallback}>
        {props.children}
    </PermissionGuard>
}