import type { useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import type { Key } from "react";
import { postReq } from "@core/utils";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function ArchiveReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const { notify } = useNotification();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: Key) => postReq(`/reservations/${id}/archive`, {}),
    onSettled: () => disclosureProps.onClose(),
    onSuccess: () => notify({ message: "Reservation has been archived", type: "success" }),
    onError: () => notify({ message: "Reservation could not be archived.", type: "danger" })
  })

  async function handleAction(id: Key) {
    await mutateAsync(id);
  }

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Archive reservation"
      confirmText="Archive reservation"
      confirmButtonProps={{ isLoading: isPending, color: "success" }}
      body={<p>The reservation will be archived.<br />Are you sure you want to continue?</p>}
      callback={handleAction.bind(null, reservation.id)}
    />
  );
}
