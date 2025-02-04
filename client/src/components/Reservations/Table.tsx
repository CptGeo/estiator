import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Spinner, Pagination, Button, useDisclosure } from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import Status from "@components/Status/Reservation/Status";
import type { ReservationData } from "@core/types";
import ReservationsActions from "@components/Reservations/Actions";
import useQueryReservations from "@hooks/useQueryReservations";
import AddIcon from "@components/Icons/AddIcon";
import CreateReservationModal from "@components/Modal/CreateReservation";
import { getFullName, toDurationString } from "@core/utils";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DATE", uid: "date" },
  { name: "TIME", uid: "time" },
  { name: "DURATION", uid: "duration" },
  { name: "TABLE", uid: "table" },
  { name: "PERSONS", uid: "persons" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ReservationsTable() {
  const { data: reservations } = useQueryReservations(500);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = reservations ? Math.ceil(reservations.length / rowsPerPage) : 0;
  const createDisclosure = useDisclosure();

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return reservations?.slice(start, end);
  }, [page, reservations]);

  const topContent = useMemo(() => {
    const count = reservations?.length;
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs text-default-600">{count! > 0 && `Total reservations: ${reservations?.length}`}</p>
        <Button color="primary" onPress={createDisclosure.onOpen}><AddIcon className="text-md" />Create reservation</Button>
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
            description={reservation.createdFor?.email || reservation.createdFor?.phone}
            name={getFullName(reservation.createdFor)}
          />
        </TableCell>
        <TableCell className="w-[20%]" textValue="Date">
          <DatePicker
            isReadOnly
            aria-label="Date"
            className="max-w-xs"
            granularity="day"
            value={date}
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="Time">
          <Input
            className="min-w-20"
            value={time.toString().slice(0, -3)}
            aria-label="Time"
            isReadOnly
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="Duration">
          <Input
            className="min-w-20"
            value={toDurationString(reservation.duration)}
            aria-label="Duration"
            isReadOnly
          />
        </TableCell>
        {reservation?.table !== null ? (
          <TableCell className="w-1/12" textValue="Table">
            <Input
              className="min-w-16"
              value={`${reservation.table.label.toString()} (${
                reservation.table.capacity
              })`}
              aria-label="Table"
              isReadOnly
            />
          </TableCell>
        ) : (
          <TableCell className="w-1/12">
            <Input
              className="min-w-16"
              value="-"
              aria-label="Table"
              isReadOnly
            />
          </TableCell>
        )}
        <TableCell className="w-[5%]" textValue="Persons">
          <Input
            className="min-w-10"
            value={reservation.persons.toString()}
            aria-label="Persons"
            isReadOnly
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="Status">
          <Status status={reservation.status} />
        </TableCell>
        <TableCell className="w-1/12" textValue="Actions">
          <div>
            <ReservationsActions reservation={reservation} />
          </div>
        </TableCell>
      </TableRow>
    );
  }, [reservations]);

  return (
    <>
      <Table
        topContentPlacement="outside"
        topContent={topContent}
        aria-label="Reservations table"
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
          {(reservation: ReservationData) => renderRow(reservation)}
        </TableBody>
      </Table>
      <CreateReservationModal {...createDisclosure} />
    </>
  );
}
