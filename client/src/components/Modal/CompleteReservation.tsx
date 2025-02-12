import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import type { Key } from "react";
import { getFullName, postReq } from "@core/utils";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function CompleteReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const { notify } = useNotification();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => postReq(`/reservations/${id}/complete`),
    onSettled: () => disclosureProps.onClose(),
    onSuccess: () => notify({ message: "Reservation has been completed!", type: "success" }),
    onError: () => notify({ message: "Reservation could not be completed.", type: "danger" })
  })

  async function handleAction(id: Key) {
    await mutateAsync(id);
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Book reservation"
      confirmText="Book reservation"
      confirmButtonProps={{ isLoading: isPending }}
      body={<p>The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be completed.<br />Are you sure you want to continue?</p>}
      callback={handleAction.bind(null, reservation.id)}
    />
  );
}
