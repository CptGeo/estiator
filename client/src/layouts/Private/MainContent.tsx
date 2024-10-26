import { Outlet } from "react-router-dom";
import DrawerMenu from "../../components/DrawerMenu/DrawerMenu";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import { useDrawer } from "../../context/Drawer";

export default function MainContent() {
  const { open } = useDrawer();

  return (
    <div className={`main min-h-screen flex flex-col transition-all ${open ? "pl-[300px]" : ""}`}>
      <Navigation />
      <DrawerMenu />
      <div className="container max-w-[1400px] mx-auto px-3 pt-3 flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}