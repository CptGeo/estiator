import type { TableData } from "@core/types";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

type ContextProps = {
  selected: TableData | null;
  selectTable: (table: TableData | null) => void;
};

const TablesContext = createContext<ContextProps | undefined>(undefined);

export default function TablesProvider({ children }: PropsWithChildren) {
  const [selected, setSelected] = useState<TableData | null>(null);

  function selectTable(table: TableData | null) {
    setSelected(table);
  }

  return (
    <TablesContext.Provider value={{ selected, selectTable }}>
      {children}
    </TablesContext.Provider>
  );
}

export const useTables = (): ContextProps => {
  const context = useContext(TablesContext);
  if (context === undefined) {
    throw new Error("useTables must be used within a TablesProvider");
  }
  return context;
};
