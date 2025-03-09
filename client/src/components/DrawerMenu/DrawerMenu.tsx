import { Button } from "@heroui/react";
import type { ReactElement } from "react";
import type { Location, To } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyAvatar from "@components/Avatar/Company";
import { useDrawer } from "@context/Drawer";
import AdminOnly from "@components/AuthorizationWrappers/AdminOnly";
import useQuerySettings from "@hooks/useQuerySettings";
import { BadgeTwoTone, CalendarMonthTwoTone, DashboardTwoTone, MenuOpenTwoTone, MenuTwoTone, PersonTwoTone, SettingsTwoTone, TableRestaurantTwoTone } from "@mui/icons-material";

export default function DrawerMenu(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useQuerySettings();

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
    <div className={`transition-transform flex flex-col h-full fixed left-0 top-0 max-w-[250px] w-full z-50 bg-slate-800 shadow-2xl px-5 pt-5 pb-2 ${!open ? "translate-x-[-100%]" : ""}`}>
      <div className="mb-5">
        {settings && <CompanyAvatar company={ { name: settings.businessName, description: settings.businessDescription }} />}
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <DrawerItem to="/" text="Dashboard" icon={<DashboardTwoTone className="text-xl" />} />
          <DrawerItem to="/reservations-management" text="Reservations" icon={<CalendarMonthTwoTone className="text-xl" />} />
          <DrawerItem to="/tables-management" text="Tables" icon={<TableRestaurantTwoTone className="text-xl" />} />
          <AdminOnly>
            <DrawerItem to="/employees-management" text="Employees" icon={<BadgeTwoTone className="text-xl" />} />
          </AdminOnly>
          <DrawerItem to="/customers-management" text="Customers" icon={<PersonTwoTone className="text-xl" />} />
        </div>

        <div className="flex flex-col gap-2">
          <DrawerItem to="/settings" text="Settings" icon={<SettingsTwoTone className="text-xl" />} />
          <div className="text-background text-opacity-30 border-t-1 border-background border-opacity-20 pt-2 text-center text-tiny">Estiator.io — v0.2.0_alpha</div>
        </div>
      </div>
      <Button onPress={toggleDrawer} className="shadow-md cursor-pointer absolute top-[18px] right-0 translate-x-full rounded-l-none p-0 text-sm" isIconOnly size="sm" variant="solid" color="warning">
        {open ? <MenuOpenTwoTone /> : <MenuTwoTone />}
      </Button>
    </div>
  )
}