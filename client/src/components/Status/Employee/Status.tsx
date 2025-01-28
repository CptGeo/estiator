import type { ReactElement } from "react";
import { Chip } from "@heroui/react";
import { UserStatus } from "@core/types";

type Props = {
    status: UserStatus | undefined
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    switch(status) {
        case UserStatus.ACTIVE :
            return <Chip color="success" size="sm" variant="shadow" className="text-content1">{UserStatus.ACTIVE}</Chip>
        case UserStatus.ON_LEAVE:
            return <Chip color="default" size="sm" variant="shadow">{UserStatus.ON_LEAVE}</Chip>
        case UserStatus.TERMINATED:
            return <Chip color="danger" size="sm" variant="shadow" className="text-content1">{UserStatus.TERMINATED}</Chip>
        default:
            return <Chip color="default" variant="flat">Unknown</Chip>
    }
}