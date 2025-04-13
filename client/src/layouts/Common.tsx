import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@components/Navigation/Navigation";

export default function CommonLayout(): ReactElement {
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
