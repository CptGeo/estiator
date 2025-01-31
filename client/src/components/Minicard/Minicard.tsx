import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
    headline?: string | number;
    icon?: ReactNode,
    description?: string | number | undefined;
    indicator?: ReactNode;
}

export default function Minicard(props: Props) {
    return (
        <Card className="py-2 px-4 w-[280px] shrink-0" shadow="sm">
            <CardBody>
                <div className="mb-1 flex flex-row flex-nowrap justify-between items-center">
                    <h4 className="text-sm text-foreground-500 font-semibold">{props.headline ?? "-"}</h4>
                    <div className="rounded-full text-cyan-600 bg-slate-100 p-2 border-1 border-cyan-600 border-opacity-20">
                        {props.icon}
                    </div>
                </div>
                <div className="flex flex-row gap-1 flex-nowrap justify-start items-end">
                    <p className="text-3xl font-bold">{props.description ?? "-"}</p>
                    {props.indicator}
                </div>
            </CardBody>
        </Card>
    )
}