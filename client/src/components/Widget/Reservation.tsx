import TickIcon from "@components/Icons/TickIcon";
import { ReservationData, ReservationStatus } from "@core/types";
import { getFullName, sortByTimeAscending } from "@core/utils";
import useQueryReservations from "@hooks/useQueryReservations";
import { isToday, parseDate } from "@internationalized/date";
import { Button, Card, CardBody, CardHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function ReservationWidget() {
  const {data: reservations} = useQueryReservations();
  const filtered = reservations?.filter(filter).sort(sortByTimeAscending);

  /**
   * Filters only upcoming, Confirmed reservations (current day only) 
   */
  function filter(reservation: ReservationData) {
    const parsed = parseDate(reservation.date);

    return isToday(parsed, "GMT") && reservation.status === ReservationStatus.CONFIRMED;
  }

  function renderRow(reservation: ReservationData) {
    return (
      <TableRow className="first:bg-primary first:text-default-50">
        <TableCell className="w-[35%]" textValue="Name">
          {getFullName(reservation.user)}
        </TableCell>
        <TableCell className="w-[30%] text-right" textValue="Date">
          {reservation.date}
        </TableCell>
        <TableCell className="w-[25%] text-right" textValue="Time">
          {reservation.time}
        </TableCell>
        <TableCell className="w-[5%]" textValue="Time">
          <Tooltip content="Set as Completed" delay={0} closeDelay={0}>
            <Button onPress={() => alert(`${reservation.id} completed`)} isIconOnly size="sm" variant="light"><TickIcon /></Button>
          </Tooltip>
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
          hideHeader={true}
          isStriped
          {...filtered && { bottomContent : <small><Link className="text-primary" to={"reservations-management"}>Check all reservations</Link></small>}}
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
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
