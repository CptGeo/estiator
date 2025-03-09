import { Outlet } from "react-router-dom";
import DrawerMenu from "@components/DrawerMenu/DrawerMenu";
import Navigation from "@components/Navigation/Navigation";
import { useDrawer } from "@context/Drawer";

export default function MainContent() {
  const { open } = useDrawer();

  return (
    <div className={`main min-h-screen flex flex-col ${open ? "pl-[250px]" : "pl-[50px]"}`}>
      <Navigation />
      <DrawerMenu />
      <div className="container max-w-[1540px] mx-auto px-5 mt-7 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}