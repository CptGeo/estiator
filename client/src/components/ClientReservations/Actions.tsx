import { Button, useDisclosure } from "@heroui/react";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import type { ReactElement } from "react";
import CancelMyReservationModal from "@components/Modal/CancelMyReservation";
import ReviewReservationModal from "@components/Modal/ReviewReservation";

type Props = {
  reservation: ReservationData;
}

export default function ClientReservationsActions(props: Props) {
  const reservation = props.reservation;
  const cancel = useDisclosure();
  const review = useDisclosure();

  return <><div className="flex gap-2 justify-center">
    {([ReservationStatus.COMPLETED].includes(reservation.status) && (
      <Button variant="flat" color="warning" onPress={review.onOpen}>Rate</Button> as ReactElement
    )) as ReactElement}
    {(![ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.BOOKED].includes(reservation.status) && (
      <Button variant="flat" color="danger" onPress={cancel.onOpen}>Cancel</Button> as ReactElement
    )) as ReactElement}
  </div>
  <CancelMyReservationModal reservation={reservation} {...cancel} />
  <ReviewReservationModal reservation={reservation} {...review} />
  </>
}