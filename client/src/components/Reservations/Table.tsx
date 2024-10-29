import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Spinner, Pagination, Button, useDisclosure } from "@nextui-org/react";
import Status from "../Status/Status";
import { parseDate, parseTime } from "@internationalized/date";
import { ReservationData } from "../../core/types";
import ReservationsActions from "./Actions";
import { getFullName } from "../../core/utils";
import useGetReservations from "../../hooks/useGetReservations";
import AddIcon from "../Icons/AddIcon";
import AddReservationModal from "../Modal/AddReservation";

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
  const addDisclosure = useDisclosure();

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return reservations?.slice(start, end);
  }, [page, reservations]);

  const topContent = useMemo(() => {
    const count = reservations?.length;
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs text-default-600">{count! > 0 && `Total ${reservations?.length} reservation${count! > 1 ? "s" : ""}`}</p>
        <Button color="primary" onClick={addDisclosure.onOpen}><AddIcon className="text-md" />Add reservation</Button>
      </div>
    )
  }, [reservations?.length]);

  const bottomContent = useMemo(() => {
    if (!reservations || reservations.length == 0) {
      return;
    }

    return (
      <div className="flex justify-center">
          <Pagination
            showControls
            showShadow
            color="primary"
            variant="flat"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
      </div>
    )
  }, [items, reservations]);

  const renderRow = useCallback((reservation: ReservationData) => {
    const date = parseDate(reservation.date);
    const time = parseTime(reservation.time);

    return (
      <TableRow>
        <TableCell className="w-[25%]" textValue="Date">
            <User
              avatarProps={{ radius: "full", size: "sm" }}
              classNames={{
                  description: "text-default-500",
              }}
              description={reservation.user.email || reservation.user.phone}
              name={getFullName(reservation.user)}
        />
        </TableCell>
        <TableCell className="w-[20%]" textValue="Date">
            <DatePicker
              isReadOnly
              aria-label="Date"
              className="max-w-xs"
              granularity="day"
              value={date} />
        </TableCell>
        <TableCell className="w-1/12" textValue="Time"><Input className="min-w-20" value={time.toString().slice(0, -3)} aria-label="Time" isReadOnly /></TableCell>
        <TableCell className="w-1/12" textValue="Table"><Input className="min-w-16"  value={reservation.table.toString()} aria-label="Table" isReadOnly /></TableCell>
        <TableCell className="w-[5%]" textValue="Persons"><Input className="min-w-10" value={reservation.persons.toString()} aria-label="Persons" isReadOnly /></TableCell>
        <TableCell className="w-1/12" textValue="Status"><Status status={reservation.status} /></TableCell>
        <TableCell className="w-1/12" textValue="Actions"><div><ReservationsActions reservation={reservation} /></div></TableCell>
    </TableRow>
    )
  }, [reservations]);

  return (
    <>
      <Table
        topContentPlacement="outside"
        topContent={topContent}
        aria-label="Example table with custom cells"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
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
      <AddReservationModal {...addDisclosure} />
    </>
  );
}
