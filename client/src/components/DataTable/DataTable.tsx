/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, DatePicker, SelectItem } from "@nextui-org/react";
import { columns, reservations, ReservationsType } from "../../_temp_data";
import DataActions from "./DataActions";
import { CalendarDate } from "@internationalized/date";
import DateTimeField from "../Fields/DateTime";
import SelectField from "../Fields/Select";
import { FormProvider, useForm } from "react-hook-form";

export default function DataTable() {
  const methods = useForm();

  const _renderCell = React.useCallback((reservation: ReservationsType, columnKey: any) => {
    const cellValue = reservations[columnKey];

    const reservationDate = reservation.date.split("-").map( (val)  => parseInt(val) );
    const calendarDate = new CalendarDate(reservationDate[0], reservationDate[1], reservationDate[3]);

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", name: "GK" }}
            description={reservation.user.email}
            name={"name"}
          >
            {reservation.user.email}
          </User>
        );
      case "date":
        return (
          <div className="flex flex-col">
            <DatePicker
              className="max-w-xs"
              granularity="day"
              defaultValue={calendarDate}
            />
          </div>
        );
      case "actions":
        return <DataActions />;
      default:
        return cellValue;
    }
  }, []);

  return (
  <FormProvider {...methods}>
    <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={reservations}>
          <TableRow>
            <TableCell><div>George Kalyvianakis</div></TableCell>
            <TableCell><div><DateTimeField/></div></TableCell>
            <TableCell><div><SelectField defaultSelectedKeys={["0"]} name="time"><SelectItem key={0}>02:00pm</SelectItem><SelectItem key={1}>01:30pm</SelectItem></SelectField></div></TableCell>
            <TableCell><div><SelectField defaultSelectedKeys={["0"]} name="table"><SelectItem key={0}>34</SelectItem><SelectItem key={1}>12</SelectItem></SelectField></div></TableCell>
            <TableCell><div><DataActions/></div></TableCell>
          </TableRow>
          {/* {(item: ReservationsType) => (
            <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
            )} */}
        </TableBody>
      </Table>
    </FormProvider>
  );
}
