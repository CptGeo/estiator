import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react"
import settings from "@settings";

type ContextProps = {
  open: boolean;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<ContextProps>({ open: false, toggleDrawer: () => {} });

export default function DrawerProvider(props: PropsWithChildren) {
  const [open, setOpen] = useState(settings.drawerOpen);

  function toggleDrawer() {
    setOpen(!open);
  }

  return <DrawerContext.Provider value={ { open, toggleDrawer } }>{props.children}</DrawerContext.Provider>
}

export const useDrawer = () => {
  return useContext(DrawerContext);
};