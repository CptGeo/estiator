import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, DatePicker, Spinner, Pagination, Button, useDisclosure, Chip, Input } from "@heroui/react";
import { UserRole, UserRoleName, type UserData } from "@core/types";
import AddIcon from "@components/Icons/AddIcon";
import CreateReservationModal from "@components/Modal/CreateReservation";
import { getFullName, parseTimestamp } from "@core/utils";
import useQueryCustomers from "@hooks/useQueryCustomers";
import CustomersActions from "./Actions";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PHONE", uid: "phone" },
  { name: "ROLE", uid: "role" },
  { name: "CREATED AT", uid: "createdAT" },
  { name: "ACTIONS", uid: "actions" }
];

export default function CustomersTable() {
  const { data: customers } = useQueryCustomers(500);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = customers ? Math.ceil(customers.length / rowsPerPage) : 0;
  const createDisclosure = useDisclosure();

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return customers?.slice(start, end);
  }, [page, customers]);

  const topContent = useMemo(() => {
    const count = customers?.length;
    return (
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs text-default-600">{count! > 0 && `Total customers: ${customers?.length}`}</p>
        <Button color="primary" onPress={createDisclosure.onOpen}><AddIcon className="text-md" />Add customer</Button>
      </div>
    )
  }, [customers?.length]);

  const bottomContent = useMemo(() => {
    if (!customers || customers.length == 0) {
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
  }, [items, customers]);

  const renderRow = useCallback((customer: UserData) => {
    const createdDate = parseTimestamp(customer.createdDate);

    return (
      <TableRow>
        <TableCell className="w-[25%]" textValue="Date">
          <User
            avatarProps={{ radius: "full", size: "sm" }}
            classNames={{
              description: "text-default-500",
            }}
            description={customer.email || customer.phone}
            name={getFullName(customer)}
          />
        </TableCell>
        <TableCell className="w-[15%]">
          <Input value={customer.phone} />
        </TableCell>
        <TableCell className="w-[10%]">
          <Chip variant="flat" color={customer.userRole === UserRole.GUEST ? "default" : "secondary"} >{UserRoleName[customer.userRole]}</Chip>
        </TableCell>
        <TableCell className="w-[20%]" textValue="Created at">
          <DatePicker
            isReadOnly
            aria-label="Date"
            className="max-w-xs"
            granularity="day"
            value={createdDate}
          />
        </TableCell>
        <TableCell className="w-1/12" textValue="Actions">
          <div>
            <CustomersActions customer={customer} />
          </div>
        </TableCell>
      </TableRow>
    );
  }, [customers]);

  return (
    <>
      <Table
        topContentPlacement="outside"
        topContent={topContent}
        aria-label="Customers table"
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
            isLoading={!Array.isArray(customers)}
            items={items || []}
            loadingContent={<Spinner label="Loading..." />}
        >
          {(customer: UserData) => renderRow(customer)}
        </TableBody>
      </Table>
      <CreateReservationModal {...createDisclosure} />
    </>
  );
}
