import { Chip } from "@nextui-org/react";
import { ReactElement } from "react";
import { Status as StatusType } from "../../core/types";

type Props = {
    status: StatusType
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    switch(status) {
        case "cancelled":
            return <Chip color="default" variant="flat">Cancelled</Chip>;
        case "completed":
            return <Chip color="success" variant="solid">Completed</Chip>;
        case "pending":
            return <Chip color="warning" variant="flat">Pending</Chip>;
        case "confirmed":
            return <Chip color="success" variant="flat">Confirmed</Chip>
    }
}