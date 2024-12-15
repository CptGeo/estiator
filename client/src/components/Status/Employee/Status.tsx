import type { ReactElement } from "react";
import { Chip } from "@nextui-org/react";
import { EmployeeStatus, EmployeeStatuses } from "@core/types";

type Props = {
    status: EmployeeStatus | undefined
}

export default function Status(props: Props): ReactElement {
    const { status } = props;

    switch(status) {
        case EmployeeStatus.ACTIVE :
            return <Chip color="success" size="sm" variant="shadow" className="text-content1">{EmployeeStatuses[EmployeeStatus.ACTIVE]}</Chip>
        case EmployeeStatus.ON_LEAVE:
            return <Chip color="default" size="sm" variant="shadow">{EmployeeStatuses[EmployeeStatus.ON_LEAVE]}</Chip>
        case EmployeeStatus.TERMINATED:
            return <Chip color="danger" size="sm" variant="shadow" className="text-content1">{EmployeeStatuses[EmployeeStatus.TERMINATED]}</Chip>
        default:
            return <Chip color="default" variant="flat">Unknown</Chip>
    }
}