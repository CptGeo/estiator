import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, useDisclosure } from "@heroui/react";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import type { Key, ReactElement } from "react";
import { MoreHorizTwoTone, StarOutline } from "@mui/icons-material";
import CancelMyReservationModal from "@components/Modal/CancelMyReservation";
import ReviewReservationModal from "@components/Modal/ReviewReservation";

type Props = {
  reservation: ReservationData;
}

enum Action {
  CANCEL = "cancel",
  REVIEW = "review",
};

export default function ClientReservationsActions(props: Props) {
  const reservation = props.reservation;
  const cancel = useDisclosure();
  const review = useDisclosure();

  function handleAction(key: Key) {
    switch(key) {
      case Action.CANCEL:
        cancel.onOpen();
        break;
      case Action.REVIEW:
        review.onOpen();
        break;
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <MoreHorizTwoTone />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Cancel reservation"
          variant="solid"
          onAction={handleAction}>

          {([ReservationStatus.COMPLETED ].includes(reservation.status) && (
            (<DropdownItem key={Action.REVIEW} startContent={<StarOutline color="warning" />} color="default">Review reservation</DropdownItem>) as ReactElement
          )) as ReactElement}

          {(![ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.BOOKED ].includes(reservation.status) && (
            (<DropdownItem key={Action.CANCEL} className="text-danger" color="danger">Cancel reservation</DropdownItem>) as ReactElement
          )) as ReactElement}

        </DropdownMenu>
      </Dropdown>
      <CancelMyReservationModal reservation={reservation} {...cancel} />
      <ReviewReservationModal reservation={reservation} {...review} />
    </>
  );
}