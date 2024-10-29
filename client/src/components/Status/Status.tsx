import { Chip } from "@nextui-org/react";
import { ReactElement } from "react";
import { ReservationStatus } from "../../core/types";

type Props = {
    status: ReservationStatus | undefined
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    switch(status) {
        case ReservationStatus.CANCELLED:
            return <Chip color="default" variant="flat">Cancelled</Chip>;
        case ReservationStatus.COMPLETED:
            return <Chip color="primary" variant="flat">Completed</Chip>;
        case ReservationStatus.PENDING:
            return <Chip color="warning" variant="flat">Pending</Chip>;
        case ReservationStatus.CONFIRMED:
            return <Chip color="success" variant="flat">Confirmed</Chip>
        default:
            return <Chip color="danger" variant="flat">Unknown</Chip>
    }
}