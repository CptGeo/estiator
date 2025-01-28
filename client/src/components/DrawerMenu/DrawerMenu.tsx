import { Button } from "@heroui/react";
import type { ReactElement } from "react";
import MenuCloseIcon from "@components/Icons/MenuCloseIcon";
import MenuOpenIcon from "@components/Icons/MenuOpenIcon";
import type { Location, To } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsIcon from "@components/Icons/SettingsIcon";
import CompanyAvatar from "@components/Avatar/Company";
import { useDrawer } from "@context/Drawer";
import TableClockIcon from "@components/Icons/TableClockIcon";
import TableIcon from "@components/Icons/TableIcon";
import DashboardIcon from "@components/Icons/DashboardIcon";
import PersonIcon from "@components/Icons/PersonIcon";
import AdminOnly from "@components/AuthorizationWrappers/AdminOnly";

export default function DrawerMenu(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const { open, toggleDrawer } = useDrawer();

  function DrawerItem(props:  { to: string, icon: ReactElement, text: string } ): ReactElement {
    const { to, icon, text } = props;

    function isCurrent(location: Location, to: To) {
      const tokens = location.pathname.split("/").splice(1);

      /** TODO: Needs to be improved. Returns `true` when at least one url token matches the current */
      for(const token of tokens) {
        if (token === to.toString().slice(1)) {
          return true;
        }
      }
      return false;
    }

    return (
      <Button
        onPress={() => navigate(to)}
        variant="light"
        className={`justify-start text-slate-300 ${isCurrent(location, to) ? "bg-slate-600" : ""}`}
        startContent={icon}>
        {text}
      </Button>
    );
  }

  return (
    <div className={`transition-transform flex flex-col h-full fixed left-0 top-0 max-w-[300px] w-full z-50 bg-slate-800 shadow-2xl px-5 pt-5 pb-2 ${!open ? "translate-x-[-100%]" : ""}`}>
      <div className="mb-5">
        <CompanyAvatar company={ { name: "Estiator.io", description: "Company description" }} />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <DrawerItem to="/" text="Dashboard" icon={<DashboardIcon className="text-xl" />} />
          <DrawerItem to="/reservations-management" text="Reservations Management" icon={<TableClockIcon className="text-xl" />} />
          <DrawerItem to="/tables-management" text="Tables Management" icon={<TableIcon className="text-xl" />} />
          <AdminOnly>
            <DrawerItem to="/employees-management" text="Employees Management" icon={<PersonIcon className="text-xl" />} />
          </AdminOnly>
        </div>

        <div className="flex flex-col gap-2">
          <DrawerItem to="/settings" text="Settings" icon={<SettingsIcon className="text-xl" />} />
        </div>
      </div>
      <Button onPress={toggleDrawer} className="shadow-md cursor-pointer absolute top-[18px] right-0 translate-x-full rounded-l-none p-0 text-sm" isIconOnly size="sm" variant="solid" color="warning">
        {open ? <MenuCloseIcon /> : <MenuOpenIcon />}
      </Button>
    </div>
  )
}