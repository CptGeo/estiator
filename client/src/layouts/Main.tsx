import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

export default function MainLayout(): ReactElement {
  return (
    <div className="main">
      <Navigation />
      <Outlet />
    </div>
  );
}
