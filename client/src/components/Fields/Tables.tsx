import { SelectItem, SelectProps } from "@nextui-org/react";
import { ReactElement } from "react";
import useQueryTables from "@hooks/useQueryTables";
import SelectField from "./Select";

type Props = {
  name: string;
  label?: string;
} & Omit<SelectProps, "children"> ;

export default function TablesSelect(props: Props): ReactElement {
  const {data: tables, isLoading} = useQueryTables();

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
