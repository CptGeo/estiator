import { useNotification } from "@context/Notification";
import { postReq } from "@core/utils";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

export default function CancellationPage() {
    const [ URLSearchParams ] = useSearchParams();
    const uuid = URLSearchParams.get("uuid");
    const navigate = useNavigate();
    const { notify } = useNotification();

    const { mutateAsync: cancel, isPending } = useMutation({
        mutationFn: (cancellationUUID: string) => postReq(`/cancelReservation/${cancellationUUID}`),
        onSuccess: () => notify({ message: "Reservation has been cancelled successfully.", type: "success" }),
        onError: () => notify({ message: "Reservation could not be cancelled", type: "danger" }),
        onSettled: () => navigate("/")
    });

    if (uuid === null) {
        return <Navigate to="/" />
    }

    async function handleCancel() {
        if (uuid === null) { return; }
        await cancel(uuid);
    }

    return (
        <div className="flex items-center justify-center flex-col mt-5">
            <div className="gap-2 mt-5 flex items-center justify-center flex-col">
                <h3 className="text-lg">Please confirm the cancellation of your reservation</h3>
                <Button color="danger" onPress={handleCancel} isLoading={isPending}>Cancel Reservation</Button>
            </div>
        </div>
    )
}