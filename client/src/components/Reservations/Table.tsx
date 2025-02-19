import { useCallback, useMemo, useState } from "react";
import type { SortDescriptor } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Input, Pagination, Button, useDisclosure, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import Status from "@components/Status/Reservation/Status";
import type { Key } from "@core/types";
import { ReservationStatus, ReservationStatuses, type ReservationData } from "@core/types";
import ReservationsActions from "@components/Reservations/Actions";
import useQueryReservations from "@hooks/useQueryReservations";
import CreateReservationModal from "@components/Modal/CreateReservation";
import { getFullName } from "@core/utils";
import WarningIcon from "@components/Icons/WarningIcon";
import AddIcon from "@components/Icons/AddIcon";
import { ChevronDownIcon } from "@components/Icons/ChevronDownIcon";
import { SearchIcon } from "@components/Icons/SearchIcon";

type Column = {
  name: string;
  uid: string;
  sortable?: boolean;
}

const columns: Column[] = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Start Time", uid: "startTime", sortable: true },
  { name: "End Time", uid: "endTime", sortable: true },
  { name: "Table", uid: "table" },
  { name: "Persons", uid: "persons", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Alert", uid: "alert" },
  { name: "Actions", uid: "actions" }
];

export default function ReservationsTable() {
  const { data: reservations } = useQueryReservations(1000);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Iterable<Key> | "all" | undefined>("all");
  const [statusFilter, setStatusFilter] = useState<Iterable<Key> | "all">("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns || []).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!reservations) { return []; }

    let filteredReservations = [...reservations];

    if (hasSearchFilter) {
      filteredReservations = filteredReservations.filter((reservation) => {
        // build a name, surname and email to search in
        const createdForNameSurnameEmail = getFullName(reservation.createdFor) + " " + reservation.createdFor.email;
        const createdByNameSurnameEmail = getFullName(reservation.createdBy) + " " + reservation.createdBy.email;

        const includesCreatedForName = createdForNameSurnameEmail.toLowerCase().includes(filterValue.toLowerCase());
        const includesCreatedByName = createdByNameSurnameEmail.toLowerCase().includes(filterValue.toLowerCase());
        return includesCreatedByName || includesCreatedForName;
      }
      );
    }

    if (statusFilter != "all" && Array.from(statusFilter).length !== Object.keys(ReservationStatuses).length) {
      filteredReservations = filteredReservations.filter((reservation) =>
        Array.from(statusFilter).includes(reservation.status)
      );
    }

    return filteredReservations;
  }, [reservations, filterValue, statusFilter]);

  const pages = filteredItems ? Math.ceil(filteredItems.length / rowsPerPage) : 0;

  const createDisclosure = useDisclosure();

  const sortedItems = useMemo(() => {
    if (!filteredItems) { return []; }
    return [...filteredItems].sort((a: ReservationData, b: ReservationData) => {

      let cmp = 0;

      if (sortDescriptor.column === "name") {
        const aFullNameAndEmail = getFullName(a.createdFor) + " " + a.createdFor.email;
        const bFullNameAndEmail = getFullName(b.createdFor) + " " + b.createdFor.email;
        cmp = aFullNameAndEmail.toLowerCase().localeCompare(bFullNameAndEmail.toLowerCase());

      } else {
        const first = a[sortDescriptor.column as keyof ReservationData] as number;
        const second = b[sortDescriptor.column as keyof ReservationData] as number;
        cmp = first < second ? -1 : first > second ? 1 : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems?.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, surname and email..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat" endContent={<ChevronDownIcon className="text-small" />}>
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {Object.values(ReservationStatuses).map((status) => (
                  <DropdownItem key={status} className="capitalize">
                    {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat" endContent={<ChevronDownIcon className="text-small" />}>
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onPress={createDisclosure.onOpen}>
              <AddIcon className="text-md" />Create reservation
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-tiny">
            Showing {filteredItems.length} out of {reservations?.length} total reservations
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              defaultValue={rowsPerPage}
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    reservations?.length,
    hasSearchFilter,
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
      case "name":
        return <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
              description: "text-default-500"
            }}
            description={reservation.createdFor?.email || reservation.createdFor?.phone}
            name={getFullName(reservation.createdFor)}
          />

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

      case "alert":
        return <>
          {hasConflicts && isPending && <Tooltip closeDelay={0} color="danger" content="Reservation overlaps with an active or pending reservation on the same date, time, and table.">
            <Button isIconOnly variant="flat" color="danger" className="p-1"><WarningIcon className="text-xl" /></Button>
          </Tooltip>}
          {hasConflicts && !isPending && <Tooltip closeDelay={0} color="warning" content="Reservation overlaps with a pending reservation on the same date, time, and table.">
            <Button isIconOnly variant="flat" color="warning" className="p-1"><WarningIcon className="text-xl" /></Button>
          </Tooltip>}
        </>
      case "actions":
      return <div className="relative">
          <ReservationsActions reservation={reservation} />
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
        <TableHeader columns={headerColumns}>
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
      <CreateReservationModal {...createDisclosure} />
    </>
  );
}
