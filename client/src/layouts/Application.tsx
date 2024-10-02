import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export default function ApplicationLayout(): ReactElement {
  return (
    <div className="main">
      <Outlet />
    </div>
  );
}
