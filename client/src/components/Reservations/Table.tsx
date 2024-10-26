import { useCallback, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, Selection, TableRow, TableCell, User, DatePicker, Input } from "@nextui-org/react";
import { columns, reservations } from "../../_temp_data";
import Status from "../Status/Status";
import DataActions from "./Actions";
import { parseDate, parseTime } from "@internationalized/date";
import { ReservationData } from "../../core/types";

export default function ReservationsTable() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const renderRow = useCallback((reservation: ReservationData) => {
    const date = parseDate(reservation.date);
    const time = parseTime(reservation.time);

    return (
      <TableRow>
        <TableCell>
            <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
                description: "text-default-500",
            }}
            description={reservation.user.email || reservation.user.phone}
            name={`${reservation.user.name} ${reservation.user.surname}`}
        />
        </TableCell>
        <TableCell>
            <DatePicker
                isReadOnly
                className="max-w-xs"
                granularity="day"
                value={date} />
        </TableCell>
        <TableCell><Input value={time.toString().slice(0, -3)} isReadOnly /></TableCell>
        <TableCell><Input value={reservation.table.toString()} isReadOnly /></TableCell>
        <TableCell><Input value={reservation.persons.toString()} isReadOnly /></TableCell>
        <TableCell><Status status={reservation.status} /></TableCell>
        <TableCell><div><DataActions /></div></TableCell>
    </TableRow>
    )
  }, []);

  return (
    <Table
      aria-label="Example table with custom cells"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={reservations}>
        {(reservation) => renderRow(reservation)}
      </TableBody>
    </Table>
  );
}
