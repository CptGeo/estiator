import { Button, User } from "@nextui-org/react";
import { ReactElement, useState } from "react";
import MenuCloseIcon from "../Icons/MenuCloseIcon";
import MenuOpenIcon from "../Icons/MenuOpenIcon";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../Icons/HomeIcon";
import PlaygroundIcon from "../Icons/PlaygroundIcon";
import SettingsIcon from "../Icons/SettingsIcon";
import CompanyAvatar from "../Avatar/Company";

export default function DrawerMenu(): ReactElement {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function DrawerItem(props:  { to: string, icon: ReactElement, text: string } ): ReactElement {
    const { to, icon, text } = props;
    return <Button onClick={() => navigate(to)} variant="light" className="justify-start text-slate-300" startContent={icon}>{text}</Button>
  }

  return (
    <div className={`transition-transform flex flex-col h-full absolute left-0 top-0 max-w-[300px] w-full z-50 bg-slate-800 drop-shadow-lg px-5 pt-5 pb-2 ${!open ? "translate-x-[-100%]" : ""}`}>
    <div className="mb-5">
      <CompanyAvatar company={ { name: "Estiator.io", description: "Company description" }} />
    </div>
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2">
        <DrawerItem to="/" text="Home" icon={<HomeIcon />} />
        <DrawerItem to="/playground" text="Playground" icon={<PlaygroundIcon />} />
      </div>

      <div className="flex flex-col gap-2">
        <DrawerItem to="/settings" text="Settings" icon={<SettingsIcon />} />
      </div>
    </div>
    <Button onClick={() => setOpen(!open)} className="cursor-pointer absolute top-[18px] right-0 translate-x-full rounded-l-none p-0 bg-slate-700 text-slate-200 text-sm" isIconOnly size="sm" variant="solid">
      {open ? <MenuCloseIcon /> : <MenuOpenIcon />}
    </Button>
  </div>
  )
}