import type { SelectProps } from "@heroui/react";
import { SelectItem } from "@heroui/react";
import { type ReactElement } from "react";
import SelectField from "@components/Fields/Select";
import type { Key, TableData } from "@core/types";

/** @description Pass the below if you need to filter data based on date, time and duration */
type DateTimeGroup = {
  date: string;
  time: string;
  duration: number;
  available?: boolean;
}

type Props = {
  tables: TableData[] | undefined;
  isLoading: boolean;
  name: string;
  label?: string;
  interval?: number;
  editKey?: Key;
} & Omit<SelectProps, "children"> & {
  dateTimeGroup?: DateTimeGroup
}

export default function TablesSelectField(props: Props): ReactElement {
  const { tables, isLoading, name, editKey, ...restProps } = props;

  return (
    <SelectField
      {...restProps}
      name={name}
      isLoading={isLoading}>
      {tables ? tables.filter(table => !table.occupied || (editKey && editKey == table.id)).map((table: TableData) => {
        const label = `${table.label} (${table.capacity}) `
        return <SelectItem value={String(table.id)} key={table.id.toString()}>{label}</SelectItem>;
      }) : []}
    </SelectField>
  );
}
