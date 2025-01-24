import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import DrawerProvider from "@context/Drawer";
import MainContent from "@layouts/Private/MainContent";
import type { UserRole } from "@core/types";
import { userIsAllowed } from "@core/auth";

export default function PrivateLayout({ permissions }: { permissions: UserRole[] }): ReactElement {
  const auth = useAuth();
  if (!auth?.token || !auth.user) {
    return <Navigate to="/login" state="User not authenticated" replace={false} />
  }

  if (!userIsAllowed(auth?.user, permissions)) {
    return <Navigate to="/unauthorized" replace={false} />
  }

  return (<DrawerProvider>
    <MainContent />
  </DrawerProvider>
  );
}