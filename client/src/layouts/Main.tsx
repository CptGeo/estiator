import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function MainLayout(): ReactElement {
  return (
    <div className="main">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
