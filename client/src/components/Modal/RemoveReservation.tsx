import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { useState } from "react";
import { deleteReq, getFullName } from "@core/utils";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function RemoveReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  async function handleAction() {
    try {
      setLoading(true);
      await deleteReq(`/reservations/${reservation.id}`);
      notify({ message: "Reservation has been deleted successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      notify({ message: "Reservation could not be deleted", type: "danger" });
    } finally {
      setLoading(false);
      disclosureProps.onClose();
    }
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Remove reservation"
      cancelText="Abort"
      confirmText="Remove"
      confirmButtonProps={{ color: "danger", isLoading: loading }}
      body={
        <p>
          The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be <strong>removed.</strong>
          <br />
          Are you sure you want to continue?
        </p>
      }
      callback={handleAction}
    />
  );
}
