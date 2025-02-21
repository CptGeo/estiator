import IconButton from "@components/IconButton/IconButton";
import TickIcon from "@components/Icons/TickIcon";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import { getFullName, postReq, sortByTime, toParsedTimeString } from "@core/utils";
import useQueryReservations from "@hooks/useQueryReservations";
import { getLocalTimeZone, isToday, parseDate, parseTime } from "@internationalized/date";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "@context/Notification";
import Status from "@components/Status/Reservation/Status";

export default function ReservationWidget() {
  const { data: reservations } = useQueryReservations(3000);
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const { mutate: book } = useMutation({
    mutationFn: (data: ReservationData) => postReq(`reservations/${data.id}/book`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
    onSuccess: () => notify({ message: "Reservation has been booked!", type: "success" }),
    onError: () => notify({ message: "Reservation could not be booked.", type: "danger" })
  });

  const { mutate: complete } = useMutation({
    mutationFn: (data: ReservationData) => postReq(`reservations/${data.id}/complete`),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
    onSuccess: () => notify({ message: "Reservation has been completed!", type: "success" }),
    onError: () => notify({ message: "Reservation could not be completed.", type: "danger" })
  });

  const filtered = useMemo(() => {
    return reservations?.filter(filter).sort((a, b) => sortByTime(a, b, "asc")) as ReservationData[];
  }, [reservations]);

  /**
   * Filters only upcoming, Confirmed reservations (current day only)
   */
  function filter(reservation: ReservationData) {
    const parsed = parseDate(reservation.date);

    /** TODO: Change GMT with local time */
    return isToday(parsed, getLocalTimeZone()) && [ReservationStatus.CONFIRMED, ReservationStatus.BOOKED].includes(reservation.status);
  }

  function renderRow(reservation: ReservationData) {
    return (
      <TableRow>
        <TableCell className="w-[20%]" textValue="Name">
          {getFullName(reservation.createdFor)}
        </TableCell>
        <TableCell className="w-[5%]" textValue="Start Time">
          {toParsedTimeString(reservation.time)}
        </TableCell>
        <TableCell className="w-[5%]" textValue="End Time">
          {parseTime(reservation.endTime).toString().slice(0, -3)}
        </TableCell>
        <TableCell className="w-[10%]" textValue="Table">
          {reservation?.table?.label ?? "-"}
        </TableCell>
        <TableCell className="w-[5%]" textValue="Persons">
          {reservation.persons}
        </TableCell>
        <TableCell className="w-[5%]" textValue="Status">
          <Status status={reservation.status} />
        </TableCell>
        <TableCell className="w-[5%]" textValue="Actions">
          {reservation.status === ReservationStatus.CONFIRMED ?
            <IconButton
              withConfirmation
              confirmationTooltip="Confirm action"
              tooltip="Reservation has arrived?"
              onPress={() => book(reservation)}
              isIconOnly
              size="sm"
              color="success"
              variant="solid"
            >
              <TickIcon className="text-lg text-content1" />
            </IconButton>
            : <IconButton
              withConfirmation
              confirmationTooltip="Confirm action"
              tooltip="Reservation completed?"
              onPress={() => complete(reservation)}
              isIconOnly
              size="sm"
              color="success"
              variant="solid"
            >
              <TickIcon className="text-lg text-content1" />
            </IconButton>

          }
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table
      isCompact
      topContent={<div>
        <h4 className="text-foreground-500 font-bold">Current daily reservations</h4>
        <p className="mt-0 text-xs text-slate-400">View the upcoming and active reservations in real time.</p>
      </div>}
      isStriped
      {...filtered && { bottomContent: <small><Link className="text-primary px-1" to={"reservations-management"}>View all reservations</Link></small> }}
    >
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Start Time</TableColumn>
        <TableColumn>End time</TableColumn>
        <TableColumn>Table</TableColumn>
        <TableColumn>Persons</TableColumn>
        <TableColumn>Status</TableColumn>
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
  );
}
