import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, useDisclosure } from "@nextui-org/react";
import MenuDotsIcon from "@components/Icons/MenuDotsIcon";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import type { Key, ReactElement } from "react";
import EditReservationModal from "@components/Modal/EditReservation";
import RemoveReservationModal from "@components/Modal/RemoveReservation";
import CancelReservationModal from "@components/Modal/CancelReservation";
import ConfirmReservationModal from "@components/Modal/ConfirmReservation";

type Props = {
  reservation: ReservationData;
}

enum Action {
  CANCEL = "cancel",
  CONFIRM = "confirm",
  EDIT = "edit",
  REMOVE = "remove"
};

export default function ReservationsActions(props: Props) {
  const reservation = props.reservation;

  const cancel = useDisclosure();
  const edit = useDisclosure();
  const confirm = useDisclosure();
  const remove = useDisclosure();

  function handleAction(key: Key) {
    switch(key) {
      case Action.CANCEL:
        cancel.onOpen();
        break;
      case Action.CONFIRM:
        confirm.onOpen();
        break;
      case Action.EDIT:
        edit.onOpen();
        break;
      case Action.REMOVE:
        remove.onOpen();
        break;
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <MenuDotsIcon className="text-2xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Action event example"
          variant="solid"
          onAction={handleAction}>
          <DropdownSection title="Manage" showDivider={reservation.status !== "cancelled"}>
            {(reservation.status === "pending" && (<DropdownItem key={Action.CONFIRM} color="success">Confirm reservation</DropdownItem>)) as ReactElement}
            <DropdownItem key={Action.EDIT}>Edit reservation</DropdownItem>
          </DropdownSection>
          {(![ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ].includes(reservation.status) && (
          <DropdownSection title="Danger zone">
          <DropdownItem key={Action.CANCEL} className="text-danger" color="danger" >
              Cancel reservation
            </DropdownItem>
          </DropdownSection>)) as ReactElement}
          <DropdownItem key={Action.REMOVE} className="text-danger" color="danger" >
              Remove
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ConfirmReservationModal reservation={reservation} {...confirm} />
      <CancelReservationModal reservation={reservation} {...cancel} />
      <RemoveReservationModal reservation={reservation} {...remove} />
      <EditReservationModal reservation={reservation} {...edit} />
    </>
  );
}