import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, useDisclosure } from "@nextui-org/react";
import MenuDotsIcon from "../Icons/MenuDotsIcon";
import { ReservationData } from "../../core/types";
import { Key, ReactElement } from "react";
import ConfirmationModal from "../Modal/Confirmation";
import { getFullName } from "../../core/utils";
import EditReservationModal from "../Modal/EditReservation";

type Props = {
  reservation: ReservationData;
}

const enum Action {
  CANCEL = "cancel",
  CONFIRM = "confirm",
  EDIT = "edit",
  REMOVE = "remove"
};

export default function ReservationsActions(props: Props) {
  const reservation = props.reservation;
  const cancelModalProps = useDisclosure();
  const editModalProps = useDisclosure();
  const confirmModalProps = useDisclosure();
  const removeModalProps = useDisclosure();

  function handleConfirm() {
    console.log(`Confirmed ${reservation.id}`);
  }

  function handleCancel() {
    console.log(`Cancel ${reservation.id}`);
  }

  function handleRemove() {
    console.log(`Remove ${reservation.id}`);
  }

  function handleAction(key: Key) {
    switch(key) {
      case Action.CANCEL:
        cancelModalProps.onOpen();
        break;
      case Action.CONFIRM:
        confirmModalProps.onOpen();
        break;
      case Action.EDIT:
        editModalProps.onOpen();
        break;
      case Action.REMOVE:
        removeModalProps.onOpen();
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
          {(!["cancelled", "removed"].includes(reservation.status) && (
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
      <ConfirmationModal
        {...cancelModalProps}
        title="Cancel reservation"
        cancelText="Abort"
        confirmText="Cancel reservation"
        confirmButtonProps={{ color: "danger" }}
        body={<p>The reservation of customer <strong>{getFullName(reservation.user)}</strong> will be cancelled. <br />Are you sure you want to continue?</p>}
        onClose={handleCancel}
      />
      <ConfirmationModal
        {...confirmModalProps}
        title="Confirm reservation"
        confirmText="Confirm reservation"
        body={<p>The reservation of customer <strong>{getFullName(reservation.user)}</strong> will be confirmed for the date <strong>{reservation.date}</strong> and time <strong>{reservation.time}</strong>.<br />Are you sure you want to continue?</p>}
        onClose={handleConfirm}
      />
      <ConfirmationModal
        {...removeModalProps}
        title="Remove reservation"
        cancelText="Abort"
        confirmText="Remove"
        confirmButtonProps={{ color: "danger" }}
        body={<p>The reservation of customer <strong>{getFullName(reservation.user)}</strong> will be <strong>removed</strong><br />Are you sure you want to continue?</p>}
        onClose={handleRemove}
      />
      <EditReservationModal reservation={reservation} {...editModalProps} />
    </>
  );
}