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

export default function ConfirmReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    const data: ReservationData = {
      ...reservation,
      status: ReservationStatus.CONFIRMED,
    };
    try {
      setLoading(true);
      await client.put(`/reservations/${reservation.id}`, { ...data });
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
      title="Confirm reservation"
      confirmText="Confirm reservation"
      confirmButtonProps={{ isLoading: loading }}
      body={<p>The reservation of customer <strong>{getFullName(reservation.user)}</strong> will be confirmed for the date <strong>{reservation.date}</strong> and time <strong>{reservation.time}</strong>.<br />Are you sure you want to continue?</p>}
      callback={handleAction}
    />
  );
}
