import { useCallback, useMemo, useState } from "react";
import type { SortDescriptor } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, DatePicker, Input, Pagination, Button, Spinner } from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import Status from "@components/Status/Reservation/Status";
import type { SettingData } from "@core/types";
import { ReservationStatus, type ReservationData } from "@core/types";
import { sortByDate, sortByHasReservationAlert, sortByTime } from "@core/utils";
import { useNavigate } from "react-router-dom";
import { AddCircleTwoTone } from "@mui/icons-material";
import useQueryMyReservations from "@hooks/useQueryMyReservations";
import ClientReservationsActions from "./Actions";

type Column = {
  name: string;
  uid: string;
  sortable?: boolean;
}

const columns: Column[] = [
  { name: "Date", uid: "date", sortable: true },
  { name: "Start Time", uid: "startTime", sortable: true },
  { name: "End Time", uid: "endTime", sortable: true },
  { name: "Table", uid: "table" },
  { name: "Persons", uid: "persons", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" }
];

export default function ClientReservationsTable(props: { defaultRowsPerPage: SettingData }) {
  const defaultRowsPerPage = props.defaultRowsPerPage;
  const { data: reservations } = useQueryMyReservations(2000);

  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(Number(defaultRowsPerPage.value));

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  const [page, setPage] = useState(1);

  const pages = reservations ? Math.ceil(reservations.length / rowsPerPage) : 0;

  function sortDefault(a: ReservationData, b: ReservationData) {
    const first = a[sortDescriptor.column as keyof ReservationData] as number;
    const second = b[sortDescriptor.column as keyof ReservationData] as number;
    return first < second ? -1 : first > second ? 1 : 0;
  }

  const sortedItems = useMemo(() => {
    if (!reservations) { return []; }
    return [...reservations].sort((a: ReservationData, b: ReservationData) => {

      let cmp = 0;

      switch(sortDescriptor.column) {
        case "alert":
          cmp = sortByHasReservationAlert(a, b);
          break;
        case "startTime":
          cmp = sortByTime(a, b);
          break;
        case "endTime":
          cmp = sortByTime(a, b);
          break;
        case "date":
          cmp = sortByDate(a.date, b.date);
          break;
        default:
          cmp = sortDefault(a, b);
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, reservations]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems?.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-3">
          <Button color="primary" onPress={() => navigate("/create-reservation")}>Create reservation <AddCircleTwoTone fontSize="small" /></Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-tiny">
            Showing {reservations?.length} out of {reservations?.length} total reservations
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              defaultValue={rowsPerPage}
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    onRowsPerPageChange,
    reservations?.length,
  ]);

  const bottomContent = useMemo(() => {
    if (!reservations || reservations.length === 0) {
      return null;
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
    );
  }, [items, reservations, page, rowsPerPage]);

  const renderCell = useCallback((reservation: ReservationData, columnKey: React.Key) => {
    const date = parseDate(reservation.date);
    const time = parseTime(reservation.time);
    const endTime = parseTime(reservation.endTime);
    const hasConflicts = reservation.conflicts > 0;
    const isPending = reservation.status === ReservationStatus.PENDING;

    switch (columnKey) {
      case "date":
        return <DatePicker
          isReadOnly
          aria-label="Date"
          className={`max-w-xs`}
          isInvalid={hasConflicts && isPending}
          granularity="day"
          value={date}
        />

      case "startTime":
        return <Input
          className="min-w-20"
          value={time.toString().slice(0, -3)}
          aria-label="Time"
          isReadOnly
          isInvalid={hasConflicts && isPending}
        />

      case "endTime":
        return <Input
            className="min-w-20"
            value={endTime.toString().slice(0, -3)}
            aria-label="End time"
            isReadOnly
            isInvalid={hasConflicts && isPending}
          />

      case "table":
        return <Input
          className="min-w-16"
          value={`${reservation.table ? reservation.table.label.toString() : "-"} ${ reservation.table ? `(${reservation.table.capacity})` : ""}`}
          aria-label="Table"
          isReadOnly
          isInvalid={hasConflicts && isPending}
        />

      case "persons":
        return <Input
          className="min-w-10"
          value={reservation.persons.toString()}
          aria-label="Persons"
          isReadOnly
        />

      case "status":
        return <Status status={reservation.status} />

      case "actions":
      return <div className="relative">
          <ClientReservationsActions reservation={reservation} />
        </div>
    }
  }, [reservations]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              align={["actions", "alert"].includes(column.uid) ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<p>No reservations to display</p>}
          isLoading={!Array.isArray(items)}
          loadingContent={<Spinner label="Loading..." />}
          items={items || []}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
      </Table>
    </>
  );
}
