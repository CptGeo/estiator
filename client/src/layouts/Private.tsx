import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../context/Authentication";

export default function PrivateLayout(): ReactElement {
  const auth = useAuth();

  if (!auth?.token || !auth.user) { 
    return <Navigate to="/login" state="User not authenticated" />
  }

  return (
    <div className="main">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
