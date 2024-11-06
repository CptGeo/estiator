import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@context/Authentication";
import DrawerProvider from "@context/Drawer";
import MainContent from "@layouts/Private/MainContent";

export default function PrivateLayout(): ReactElement {
  const auth = useAuth();

  if (!auth?.token || !auth.user) {
    return <Navigate to="/login" state="User not authenticated" />
  }

  return (
    <DrawerProvider>
      <MainContent />
    </DrawerProvider>
  );
}