import type { ReactElement } from "react";
import { Chip } from "@nextui-org/react";
import type { Color } from "@core/types";
import { ReservationStatus } from "@core/types";

type Props = {
    status: ReservationStatus | undefined
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    const Color: Record<ReservationStatus, Color> = {
        [ReservationStatus.CANCELLED]: "default",
        [ReservationStatus.COMPLETED]: "primary",
        [ReservationStatus.PENDING]: "warning",
        [ReservationStatus.CONFIRMED]: "success",
    }

    return <Chip color={Color[status as ReservationStatus] ?? "danger"} variant="flat">{status}</Chip>
}