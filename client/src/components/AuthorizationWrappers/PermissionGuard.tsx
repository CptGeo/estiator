import { useAuth } from "@context/Authentication";
import { userIsAllowed } from "@core/auth";
import type { UserRole } from "@core/types";
import type { PropsWithChildren, ReactElement } from "react";

type Props = PropsWithChildren<{
    permissions: UserRole[]
}>;

/**
 * Wrapper component that renders element only if user has permission to view the contents
 */
export default function PermissionGuard(props: Props): ReactElement | null {
    const { permissions, children } = props;
    const auth = useAuth();
    const user = auth?.user;

    if (!user || !userIsAllowed(user, permissions)) {
        return null;
    }

    return <>{children}</>
}