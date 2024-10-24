import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react"

type DrawerValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DrawerContext = createContext<DrawerValue>({ open: false, setOpen: () => {} });

export function DrawerProvider( props: PropsWithChildren ) {
  const [open, setOpen] = useState(false);

  return <DrawerContext.Provider value={ { open, setOpen } }>{props.children}</DrawerContext.Provider>
}

export default DrawerProvider;

export const useDrawer = () => {
  return useContext(DrawerContext);
};