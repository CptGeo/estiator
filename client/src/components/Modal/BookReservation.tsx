import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ErrorResponse, ReservationData } from "@core/types";
import { type Key } from "react";
import { getFullName, postReq, statusError, statusSuccess } from "@core/utils";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function BookReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const { notify } = useNotification();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => postReq(`/reservations/${id}/book`),
    onSettled: (data) => {
      if (statusSuccess(data?.status)) {
        notify({ message: "Reservations has been created successfully!", type: "success" })
      }
      if (statusError(data?.status)) {
        notify({
          description: (data?.data as ErrorResponse).details,
          message: (data?.data as ErrorResponse).message,
          type: "danger" })
      }
      disclosureProps.onClose();
    }
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
      body={<p>The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be booked.<br />Are you sure you want to continue?</p>}
      callback={() => handleAction(reservation.id)}
    />
  );
}
