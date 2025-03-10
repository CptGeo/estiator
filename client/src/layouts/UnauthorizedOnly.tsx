import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navigation from "@components/Navigation/Navigation";
import { useAuth } from "@context/Authentication";

export default function UnauthorizedOnlyLayout(): ReactElement {
  const auth = useAuth();

  if (auth?.user && auth.token) {
    return <Navigate to="/" />
  }

  return (
    <div className="main flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow px-5 container mx-auto">
        <Outlet />
      </div>
      <div/>
    </div>
  );
}
