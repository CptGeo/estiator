import type { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import { useState } from "react";
import { client } from "@core/request";
import { getFullName } from "@core/utils";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function CancelReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [loading, setLoading] = useState(false);

  /** @todo Replace with useMutation */
  async function handleAction() {
    const data = {
      status: ReservationStatus.CANCELLED,
    };
    try {
      setLoading(true);
      await client.patch(`/reservations/${reservation.id}`, { ...data });
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
      title="Cancel reservation"
      cancelText="Abort"
      confirmText="Cancel reservation"
      confirmButtonProps={{ color: "danger", isLoading: loading }}
      body={
        <p>
          The reservation of customer
          <strong>{getFullName(reservation.createdFor)}</strong> will be cancelled.
          <br />
          Are you sure you want to continue?
      </p>
      }
      callback={handleAction}
    />
  );
}
