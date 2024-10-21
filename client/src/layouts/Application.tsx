import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function ApplicationLayout(): ReactElement {
  return (
    <div className="main">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
