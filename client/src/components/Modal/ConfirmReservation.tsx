import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { ReservationStatus } from "@core/types";
import type { Key } from "react";
import { getFullName, patchReq } from "@core/utils";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function ConfirmReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const { notify } = useNotification();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => patchReq(`/reservations/${id}`, { status: ReservationStatus.CONFIRMED }),
    onSettled: () => disclosureProps.onClose(),
    onSuccess: () => notify({ message: "Reservation has been confirmed!", type: "success" }),
    onError: () => notify({ message: "Reservation could not be confirmed.", type: "danger" })
  })

  async function handleAction(id: Key) {
    await mutateAsync(id);
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Confirm reservation"
      confirmText="Confirm reservation"
      confirmButtonProps={{ isLoading: isPending }}
      body={<p>The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be confirmed for the date <strong>{reservation.date}</strong> and time <strong>{reservation.time}</strong>.<br />Are you sure you want to continue?</p>}
      callback={handleAction.bind(null, reservation.id)}
    />
  );
}
