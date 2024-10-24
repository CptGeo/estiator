import { createContext, PropsWithChildren, useContext, useState } from "react"
import settings from "../settings.json";

type DrawerValue = {
  open: boolean;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerValue>({ open: false, toggleDrawer: () => {} });

export function DrawerProvider( props: PropsWithChildren ) {
  const [open, setOpen] = useState(settings.drawerOpen);

  function toggleDrawer() {
    setOpen(!open);
  }

  return <DrawerContext.Provider value={ { open, toggleDrawer } }>{props.children}</DrawerContext.Provider>
}

export default DrawerProvider;

export const useDrawer = () => {
  return useContext(DrawerContext);
};