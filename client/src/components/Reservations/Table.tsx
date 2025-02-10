import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Spinner, Pagination, Button, useDisclosure, Tooltip } from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import Status from "@components/Status/Reservation/Status";
import { ReservationStatus, type ReservationData } from "@core/types";
import ReservationsActions from "@components/Reservations/Actions";
import useQueryReservations from "@hooks/useQueryReservations";
import AddIcon from "@components/Icons/AddIcon";
import CreateReservationModal from "@components/Modal/CreateReservation";
import { getFullName } from "@core/utils";
import WarningIcon from "@components/Icons/WarningIcon";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DATE", uid: "date" },
  { name: "START TIME", uid: "startTime" },
  { name: "END TIME", uid: "endTime" },
  { name: "TABLE", uid: "table" },
  { name: "PERSONS", uid: "persons" },
  { name: "STATUS", uid: "status" },
  { name: "ALERT", uid: "alert" },
  { name: "ACTIONS", uid: "actions" }
];

export default function ReservationsTable() {
  const { data: reservations } = useQueryReservations(1000);
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
    const endTime = parseTime(reservation.endTime);
    const hasConflicts = reservation.conflicts > 0;
    const isPending = reservation.status === ReservationStatus.PENDING;

    return (
      <TableRow key={reservation.id.toString()}>
        <TableCell className="w-4/12" textValue="Date">
          <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
              description: "text-default-500"
            }}
            description={reservation.createdFor?.email || reservation.createdFor?.phone}
            name={getFullName(reservation.createdFor)}
          />
        </TableCell>
        <TableCell className="w-2/12" textValue="Date">
          <DatePicker
            isReadOnly
            aria-label="Date"
            className={`max-w-xs`}
            isInvalid={hasConflicts && isPending}
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
              isInvalid={hasConflicts && isPending}
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="End Time">
          <Input
            className="min-w-20"
            value={endTime.toString().slice(0, -3)}
            aria-label="End time"
            isReadOnly
            isInvalid={hasConflicts && isPending}
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="Table">
          <Input
            className="min-w-16"
            value={`${reservation.table ? reservation.table.label.toString() : "-"} ${ reservation.table ? `(${reservation.table.capacity})` : ""}`}
            aria-label="Table"
            isReadOnly
            isInvalid={hasConflicts && isPending}
          />
        </TableCell>
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
        <TableCell  className="w-1/12 text-center" textValue="Alert">
          {hasConflicts && isPending && <Tooltip closeDelay={0} color="danger" content="Reservation overlaps with an active or pending reservation on the same date, time, and table.">
            <Button isIconOnly variant="flat" color="danger" className="p-1"><WarningIcon className="text-xl" /></Button>
          </Tooltip>}
          {hasConflicts && !isPending && <Tooltip closeDelay={0} color="warning" content="Reservation overlaps with a pending reservation on the same date, time, and table.">
            <Button isIconOnly variant="flat" color="warning" className="p-1"><WarningIcon className="text-xl" /></Button>
          </Tooltip>}
        </TableCell>
        <TableCell className="w-1/12" textValue="Actions">
          <div className="relative">
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
              align={["actions", "alert"].includes(column.uid) ? "center" : "start"}
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
