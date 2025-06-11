import type { PropsWithChildren, ReactElement } from "react";
import PermissionGuard from "./PermissionGuard";
import { UserRole } from "@core/types";

type Props = PropsWithChildren<{fallback?: ReactElement}>;

export default function ModeratorOnly(props: Props): ReactElement | null {
    return <PermissionGuard permissions={[UserRole.ADMIN, UserRole.MODERATOR]} fallback={props.fallback}>
        {props.children}
    </PermissionGuard>
}