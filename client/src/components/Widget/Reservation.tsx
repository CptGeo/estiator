import IconButton from "@components/IconButton/IconButton";
import TickIcon from "@components/Icons/TickIcon";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import { getFullName, patchReq, sortByTimeAscending } from "@core/utils";
import useQueryReservations from "@hooks/useQueryReservations";
import { getLocalTimeZone, isToday, parseDate } from "@internationalized/date";
import { Card, CardBody, CardHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function ReservationWidget() {
  const { data: reservations } = useQueryReservations(5000);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: ReservationData) => patchReq(`reservations/${data.id}`, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
    }
  });

  const filtered = useMemo(() => {
    return reservations?.filter(filter).sort(sortByTimeAscending) as ReservationData[];
  }, [reservations]);

  /**
   * Filters only upcoming, Confirmed reservations (current day only)
   */
  function filter(reservation: ReservationData) {
    const parsed = parseDate(reservation.date);

    /** TODO: Change GMT with local time */
    return isToday(parsed, getLocalTimeZone()) && reservation.status === ReservationStatus.CONFIRMED;
  }

  function renderRow(reservation: ReservationData) {
    return (
      <TableRow>
        <TableCell className="w-[35%]" textValue="Name">
          {getFullName(reservation.createdFor)}
        </TableCell>
        <TableCell className="w-[30%]" textValue="Date">
          {reservation.date}
        </TableCell>
        <TableCell className="w-[25%]" textValue="Time">
          {reservation.time}
        </TableCell>
        <TableCell className="w-[10%]" textValue="Table">
          {reservation.table.label}
        </TableCell>
        <TableCell className="w-[5%]" textValue="Time">
          <IconButton
            withConfirmation
            confirmationTooltip="Confirm action"
            tooltip="Set as completed"
            onPress={() => mutate({
              ...reservation,
              status: ReservationStatus.COMPLETED,
            })}
            isIconOnly
            size="sm"
            color="success"
            variant="solid"
          >
            <TickIcon className="text-lg text-content1" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">status</p>
        <small className="text-default-500"></small>
        <h4>Upcoming reservations</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Table
          hideHeader={false}
          isStriped
          {...filtered && { bottomContent: <small><Link className="text-primary" to={"reservations-management"}>View all reservations</Link></small> }}
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Table</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody
            items={filtered || []}
            isLoading={typeof filtered === "undefined"}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={<p>No reservations to display</p>}
          >
            {(item) => renderRow(item)}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
