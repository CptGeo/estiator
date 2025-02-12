import type { SelectProps } from "@heroui/react";
import { SelectItem } from "@heroui/react";
import { type ReactElement } from "react";
import useQueryTables from "@hooks/useQueryTables";
import SelectField from "@components/Fields/Select";
import type { TableData } from "@core/types";

/** @description Pass the below if you need to filter data based on date, time and duration */
type DateTimeGroup = {
  date: string;
  time: string;
  duration: number;
  available?: boolean;
}

type Props = {
  name: string;
  label?: string;
  interval?: number;
} & Omit<SelectProps, "children"> & {
  dateTimeGroup?: DateTimeGroup
}

export default function TablesSelectField(props: Props): ReactElement {
  const { dateTimeGroup, interval, ...restProps } = props;
  const { data: tables, isLoading } = useQueryTables(interval, {}, dateTimeGroup);

  return (
    <SelectField
      {...restProps}
      isLoading={isLoading}>
      {tables ? tables.map((table: TableData) => {
        const label = `${table.label} (${table.capacity}) `
        return <SelectItem value={String(table.id)} key={table.id}>{label}</SelectItem>;
      }) : []}
    </SelectField>
  );
}
