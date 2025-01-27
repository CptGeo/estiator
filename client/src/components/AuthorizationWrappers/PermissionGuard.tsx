import { useAuth } from "@context/Authentication";
import { userIsAllowed } from "@core/auth";
import type { UserRole } from "@core/types";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";

type Props = PropsWithChildren<{
    permissions: UserRole[],
    fallback?: ReactElement
}>;

/**
 * Wrapper component that renders element only if user has permission to view the contents
 */
export default function PermissionGuard(props: Props): ReactNode | null {
    const { permissions, children, fallback } = props;
    const auth = useAuth();
    const user = auth?.user;

    if (!user || !userIsAllowed(user, permissions)) {
        return fallback ?? null;
    }

    return children;
}