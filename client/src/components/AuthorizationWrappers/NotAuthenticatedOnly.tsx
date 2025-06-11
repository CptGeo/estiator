import type { PropsWithChildren, ReactElement } from "react";
import PermissionGuard from "./PermissionGuard";

type Props = PropsWithChildren<{fallback?: ReactElement}>;

export default function NotAuthenticatedOnly(props: Props): ReactElement | null {
    return <PermissionGuard permissions={[]} fallback={props.fallback}>
        {props.children}
    </PermissionGuard>
}