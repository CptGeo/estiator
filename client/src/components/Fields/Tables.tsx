import { SelectItem, SelectProps } from "@nextui-org/react";
import { ReactElement } from "react";
import useGetTables from "../../hooks/useGetTables";
import SelectField from "./Select";

type Props = {
  name: string;
  label?: string;
} & Omit<SelectProps, "children"> ;

export default function TablesSelect(props: Props): ReactElement {
  const tables = useGetTables();
  const isLoading = typeof tables === "undefined";

  return (
    <SelectField
      {...props}
      isLoading={isLoading}>
      {tables ? tables.map((table) => {
        const label = `${table.label} (${table.capacity}) `
        return <SelectItem value={String(table.id)} key={table.id}>{label}</SelectItem>;
      }) : []}
    </SelectField>
  );
}
