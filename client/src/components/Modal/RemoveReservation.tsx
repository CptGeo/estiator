import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { useState } from "react";
import { deleteReq, getFullName } from "@core/utils";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function RemoveReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    try {
      setLoading(true);
      await deleteReq(`/reservations/${reservation.id}`);
    } catch (error) {
      console.error(error);
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
