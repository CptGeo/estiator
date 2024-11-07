import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import AuthProvider from "@context/Authentication";

export default function AuthLayout(): ReactElement {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
