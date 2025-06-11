import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import type { Key } from "react";
import { postReq } from "@core/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function CancelMyReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => postReq(`/reservations/me/${id}/cancel`, {}),
    onSettled: () => {
      disclosureProps.onClose();
      queryClient.invalidateQueries({ queryKey: ["/reservations/me"] });
      queryClient.refetchQueries({ queryKey: ["/reservations/me"] });
    },
    onSuccess: () => notify({ message: "Reservation has been cancelled.", type: "success" }),
    onError: () =>  notify({ message: "Reservation could not be cancelled.", type: "danger" })
  })

  async function handleAction(id: Key) {
    await mutateAsync(id);
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Cancel reservation"
      cancelText="Abort"
      confirmText="Cancel reservation"
      confirmButtonProps={{ color: "danger", isLoading: isPending }}
      body={
        <p>
          Your reservation will be cancelled.
          <br />
          Are you sure you want to continue?
      </p>
      }
      callback={handleAction.bind(null, reservation.id)}
    />
  );
}
