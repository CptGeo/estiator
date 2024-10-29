import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function MainLayout(): ReactElement {
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
