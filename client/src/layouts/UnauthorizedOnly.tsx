import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navigation from "@components/Navigation/Navigation";
import { useAuth } from "@context/Authentication";
import { getRootPage } from "@core/utils";

export default function UnauthorizedOnlyLayout(): ReactElement {
  const auth = useAuth();

  if (auth?.user && auth.token) {
    return <Navigate to={getRootPage(auth.user.userRole)} />
  }

  return (
    <div className="main flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow px-5 container mx-auto pb-5">
        <Outlet />
      </div>
      <div/>
    </div>
  );
}
