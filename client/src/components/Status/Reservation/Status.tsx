import type { ReactElement } from "react";
import { Chip } from "@heroui/react";
import type { Color } from "@core/types";
import { ReservationStatus } from "@core/types";

type Props = {
    status: ReservationStatus | undefined;
}

type ChipVariant = "dot" | "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | undefined;

export default function Status(props: Props): ReactElement {
    const { status } = props;

    if (!status) {
        return <Chip color="danger" variant="flat">Unknown</Chip>
    }

    const chipProps: Record<ReservationStatus, { color: Color, variant?: ChipVariant }> = {
        [ReservationStatus.CANCELLED]: { color: "default", variant: "flat" },
        [ReservationStatus.COMPLETED]: { color: "primary", variant: "flat" },
        [ReservationStatus.PENDING]: { color: "warning", variant: "flat" },
        [ReservationStatus.CONFIRMED]: { color: "success", variant: "flat" },
        [ReservationStatus.BOOKED]: { color: "secondary", variant: "flat" }
    }

    return <Chip{...chipProps[status]}>{status}</Chip>
}