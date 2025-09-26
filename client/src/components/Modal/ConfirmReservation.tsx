import { Checkbox, type useDisclosure } from "@heroui/react";
import ConfirmationModal from "@components/Modal/Confirmation";
import type { ReservationData } from "@core/types";
import { useState } from "react";
import { getFullName, postReq, statusError, statusSuccess, toParsedTimeString } from "@core/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@context/Notification";

type Props = {
  reservation: ReservationData;
} & ReturnType<typeof useDisclosure>;

export default function ConfirmReservationModal(props: Props) {
  const { reservation, ...disclosureProps } = props;
  const [inform, setInform] = useState(false);
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => postReq(`/reservations/${reservation.id}/confirm`, {}, { params: { inform } }),
    onSettled: (data) => {
      if (statusSuccess(data?.status)) {
        notify({ message: "Reservations has been confirmed successfully!", type: "success" })
        queryClient.invalidateQueries({ queryKey: [`/reservations/${reservation.id}`] });
        queryClient.refetchQueries({ queryKey: [`/reservations/${reservation.id}`] });
      }
      else if (!data?.status || statusError(data?.status)) {
        notify({ message: "Reservation could not be confirmed.", type: "danger" })
      }
      disclosureProps.onClose()
    },
  })

  return (
    <ConfirmationModal
      {...disclosureProps}
      title="Confirm reservation"
      confirmText="Confirm reservation"
      confirmButtonProps={{ isLoading: isPending }}
      body={
        <div className="flex flex-col gap-3">
          <p>The reservation of customer <strong>{getFullName(reservation.createdFor)}</strong> will be confirmed for the date <strong>{reservation.date}</strong> and time <strong>{toParsedTimeString(reservation.time)}</strong>.
            Are you sure you want to continue?<br />
          </p>
          <Checkbox onChange={() => setInform(!inform)}>Inform client about the changes</Checkbox>
        </div>
      }
      callback={async () => { mutateAsync() }}
    />
  );
}
