import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navigation from "@components/Navigation/Navigation";
import Footer from "@components/Footer/Footer";
import { useAuth } from "@context/Authentication";

export default function UnauthorizedLayout(): ReactElement {
  const auth = useAuth();

  if (auth?.user && auth.token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="main flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow px-5 container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
