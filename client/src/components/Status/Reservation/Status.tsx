import type { ReactElement } from "react";
import { Chip } from "@heroui/react";
import type { Color } from "@core/types";
import { ReservationStatus } from "@core/types";

type Props = {
    status: ReservationStatus | undefined;
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    if (!status) {
        return <Chip color="danger" variant="flat">Unknown</Chip>
    }

    const Color: Record<ReservationStatus, Color> = {
        [ReservationStatus.CANCELLED]: "default",
        [ReservationStatus.COMPLETED]: "primary",
        [ReservationStatus.PENDING]: "warning",
        [ReservationStatus.CONFIRMED]: "success",
        [ReservationStatus.BOOKED]: "secondary"
    }

    return <Chip color={Color[status]} variant="flat">{status}</Chip>
}