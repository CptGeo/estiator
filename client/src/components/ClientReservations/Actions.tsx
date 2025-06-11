import { Button, useDisclosure } from "@heroui/react";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import type { ReactElement } from "react";
import CancelMyReservationModal from "@components/Modal/CancelMyReservation";
import ReviewReservationModal from "@components/Modal/ReviewReservation";
import { Star, StarOutline } from "@mui/icons-material";

type Props = {
  reservation: ReservationData;
}

export default function ClientReservationsActions(props: Props) {
  const reservation = props.reservation;
  const cancel = useDisclosure();
  const review = useDisclosure();

  const getStars = (reservation: ReservationData) => {
    return Array(6).fill(0).map((_, i) => i < (reservation.rating ?? 0) ? <Star color="warning" fontSize="small" key={i}/> : <StarOutline color="disabled" fontSize="small" key={i} /> );
  }

  if(reservation.rating) {
    return (
      <div className="flex gap-2 justify-center">
        <div className="flex flex-nowrap">
          {getStars(reservation)}
        </div>
      </div>
    )
  }

  return <><div className="flex gap-2 justify-center">
    {([ReservationStatus.COMPLETED].includes(reservation.status) && (!reservation.rating && !reservation.review) && (
      <Button variant="flat" size="sm" fullWidth color="warning" onPress={review.onOpen}>Rate</Button> as ReactElement
    )) as ReactElement}
    {(![ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.BOOKED].includes(reservation.status) && (
      <Button variant="flat" size="sm" fullWidth color="danger" onPress={cancel.onOpen}>Cancel</Button> as ReactElement
    )) as ReactElement}
  </div>
  <CancelMyReservationModal reservation={reservation} {...cancel} />
  <ReviewReservationModal reservation={reservation} {...review} />
  </>
}