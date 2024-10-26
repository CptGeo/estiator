import { Chip } from "@nextui-org/react";
import { ReactElement } from "react";
import { ReservationStatus } from "../../core/types";

type Props = {
    status: ReservationStatus | undefined
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    switch(status) {
        case "cancelled":
            return <Chip color="default" variant="flat">Cancelled</Chip>;
        case "completed":
            return <Chip color="primary" variant="flat">Completed</Chip>;
        case "pending":
            return <Chip color="warning" variant="flat">Pending</Chip>;
        case "confirmed":
            return <Chip color="success" variant="flat">Confirmed</Chip>
        default:
            return <Chip color="danger" variant="flat">Unknown</Chip>
    }
}