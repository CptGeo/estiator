import { useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Spinner } from "@nextui-org/react";
// import { reservations } from "../../_temp_data";
import Status from "../Status/Status";
import { parseDate, parseTime } from "@internationalized/date";
import { ReservationData } from "../../core/types";
import ReservationsActions from "./Actions";
import { getFullName } from "../../core/utils";
import useGetReservations from "../../hooks/useGetReservations";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DATE", uid: "date" },
  { name: "TIME", uid: "time" },
  { name: "TABLE", uid: "table" },
  { name: "PERSONS", uid: "persons" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ReservationsTable() {
  const { data: reservations } = useGetReservations();

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
              name={getFullName(reservation.user)}
        />
        </TableCell>
        <TableCell>
            <DatePicker
              isReadOnly
              aria-label="Date"
              className="max-w-xs"
              granularity="day"
              value={date} />
        </TableCell>
        <TableCell><Input value={time.toString().slice(0, -3)} aria-label="Time" isReadOnly /></TableCell>
        <TableCell><Input value={reservation.table.toString()} aria-label="Table" isReadOnly /></TableCell>
        <TableCell><Input value={reservation.persons.toString()} aria-label="Persons" isReadOnly /></TableCell>
        <TableCell><Status status={reservation.status} /></TableCell>
        <TableCell><div><ReservationsActions reservation={reservation} /></div></TableCell>
    </TableRow>
    )
  }, [reservations]);

  return (
    <Table aria-label="Example table with custom cells">
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
      <TableBody
          emptyContent={<p>Currently, there are no reservations</p>}
          isLoading={!Array.isArray(reservations)}
          items={reservations || []}
          loadingContent={<Spinner label="Loading..." />}
      >
        {(reservation) => renderRow(reservation)}
      </TableBody>
    </Table>
  );
}
