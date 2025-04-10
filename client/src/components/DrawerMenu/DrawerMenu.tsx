import { Button } from "@heroui/react";
import type { ReactElement } from "react";
import type { Location, To } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import CompanyAvatar from "@components/Avatar/Company";
import { useDrawer } from "@context/Drawer";
import AdminOnly from "@components/AuthorizationWrappers/AdminOnly";
import useQuerySettings from "@hooks/useQuerySettings";
import { BadgeTwoTone, CalendarMonthTwoTone, DashboardTwoTone, MenuOpenTwoTone, MenuTwoTone, PersonTwoTone, SettingsTwoTone, TableRestaurantTwoTone } from "@mui/icons-material";
import classNames from "classnames";
import ModeratorOnly from "@components/AuthorizationWrappers/ModeratorOnly";
import ClientOnly from "@components/AuthorizationWrappers/ClientOnly";

export default function DrawerMenu(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useQuerySettings();

  const { open, toggleDrawer } = useDrawer();

  function DrawerItem(props:  { to: string, icon: ReactElement, text: string, isIconOnly?: boolean } ): ReactElement {
    const { to, icon, text, isIconOnly = false } = props;

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
        isIconOnly={isIconOnly}
        className={classNames([
          " text-slate-300",
          isCurrent(location, to) ? "bg-slate-600" : "",
          !isIconOnly && "justify-start"
        ])}
        startContent={icon}>
        {!isIconOnly && text}
      </Button>
    );
  }

  return (
    <div className={classNames([
      "flex flex-col h-full fixed left-0 top-0 z-50 bg-slate-800 shadow-2xl pt-3 pb-2",
      !open ? "px-1 w-[50px]" : "px-5 w-[250px]"
    ])}>
      <div className={classNames([
          !open && "justify-center"
      ])}>
        <ModeratorOnly>
          {settings && <CompanyAvatar menuOpen={open} company={ { name: settings.businessName, description: settings.businessDescription }} />}
        </ModeratorOnly>
      </div>
      <div className="flex flex-col justify-between h-full pt-5">
        <div className={classNames([
          "flex flex-col gap-2 justify-center",
          !open && "items-center"
        ])}>
          <ClientOnly>
            <DrawerItem to="/client-reservations" text="Reservations" isIconOnly={!open} icon={<CalendarMonthTwoTone className="text-xl" />} />
            <DrawerItem to="/client-settings" text="Settings" isIconOnly={!open} icon={<SettingsTwoTone className="text-xl" />} />
          </ClientOnly>
          <ModeratorOnly>
            <DrawerItem to="/" text="Dashboard" isIconOnly={!open} icon={<DashboardTwoTone className="text-xl" />} />
            <DrawerItem to="/reservations-management" isIconOnly={!open} text="Reservations" icon={<CalendarMonthTwoTone className="text-xl" />} />
            <DrawerItem to="/tables-management" isIconOnly={!open} text="Tables" icon={<TableRestaurantTwoTone className="text-xl" />} />
            <AdminOnly>
              <DrawerItem to="/employees-management" isIconOnly={!open} text="Employees" icon={<BadgeTwoTone className="text-xl" />} />
            </AdminOnly>
            <DrawerItem to="/customers-management" isIconOnly={!open} text="Customers" icon={<PersonTwoTone className="text-xl" />} />
          </ModeratorOnly>
        </div>

        <div className={classNames([
          "flex flex-col gap-2 justify-center overflow-hidden",
          !open && "items-center"
        ])}>
          <ModeratorOnly>
            <DrawerItem to="/settings" text="Settings" isIconOnly={!open} icon={<SettingsTwoTone className="text-xl" />} />
          </ModeratorOnly>
          <div className={classNames([
            "text-background border-t-1 border-background border-opacity-20 pt-2 text-center text-tiny text-nowrap",
            !open ? "text-opacity-0" : "text-opacity-30"
          ])}>Estiator.io — v0.3.0_alpha</div>
        </div>
      </div>
      <Button onPress={toggleDrawer} className="shadow-md cursor-pointer absolute top-[18px] right-0 translate-x-full rounded-l-none p-0 text-sm" isIconOnly size="sm" variant="solid" color="warning">
        {open ? <MenuOpenTwoTone /> : <MenuTwoTone />}
      </Button>
    </div>
  )
}