import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Spinner, Pagination } from "@nextui-org/react";
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = reservations ? Math.ceil(reservations.length / rowsPerPage) : 0;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return reservations?.slice(start, end);
  }, [page, reservations]);

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
        <TableCell textValue="Date">
            <DatePicker
              isReadOnly
              aria-label="Date"
              className="max-w-xs"
              granularity="day"
              value={date} />
        </TableCell>
        <TableCell textValue="Time"><Input className="min-w-20" value={time.toString().slice(0, -3)} aria-label="Time" isReadOnly /></TableCell>
        <TableCell textValue="Table"><Input className="min-w-16" value={reservation.table.toString()} aria-label="Table" isReadOnly /></TableCell>
        <TableCell textValue="Persons"><Input className="min-w-10" value={reservation.persons.toString()} aria-label="Persons" isReadOnly /></TableCell>
        <TableCell textValue="Status"><Status status={reservation.status} /></TableCell>
        <TableCell textValue="Actions"><div><ReservationsActions reservation={reservation} /></div></TableCell>
    </TableRow>
    )
  }, [reservations]);

  return (
    <Table
      aria-label="Example table with custom cells"
      bottomContent={
        reservations && <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="danger"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
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
      <TableBody
          emptyContent={<p>No reservations to display</p>}
          isLoading={!Array.isArray(reservations)}
          items={items || []}
          loadingContent={<Spinner label="Loading..." />}
      >
        {(reservation) => renderRow(reservation)}
      </TableBody>
    </Table>
  );
}
