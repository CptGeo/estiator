import { Checkbox, type useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { useState, type Key } from "react";
import { getFullName, postReq } from "@core/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function CancelReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [inform, setInform] = useState(false);
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => postReq(`/reservations/${id}/cancel`, {}, { params: { inform } }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`/reservations/${reservation.id}`] });
      queryClient.refetchQueries({ queryKey: [`/reservations/${reservation.id}`] });
      disclosureProps.onClose()
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
        <div className="flex flex-col gap-3">
          <p>
            The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be cancelled.
            Are you sure you want to continue?
          </p>
          <Checkbox onChange={() => setInform(!inform)}>Inform client about the changes</Checkbox>
        </div>
      }
      callback={handleAction.bind(null, reservation.id)}
    />
  );
}
