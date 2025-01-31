import useQueryReservations from "@hooks/useQueryReservations"
import Minicard from "./Minicard";
import TableClockIcon from "@components/Icons/TableClockIcon";
import { endOfMonth, today } from "@internationalized/date";
import { useMemo } from "react";
import { isInteger, isUndefined } from "@core/utils";
import { Tooltip } from "@heroui/react";

export default function TotalReservations() {
    const currentMonth = endOfMonth(today("Europe/Athens"));
    const previousMonth = currentMonth.subtract({ months: 1 });

    const { data: currentReservations } = useQueryReservations<number>(3000, { params: { count: true, date: currentMonth.toString() } });
    const { data: lastMonthReservations } = useQueryReservations<number>(3000, { params: { count: true, date: previousMonth.toString() } });

    const change = useMemo(() => {
        if (!isUndefined(currentReservations) && isInteger(currentReservations) && !isUndefined(lastMonthReservations) && isInteger(lastMonthReservations)) {
            const diff = currentReservations - lastMonthReservations;
            const percentage = (diff / currentReservations) * 100;
            return Number(percentage.toFixed(1));
        }
    }, [currentReservations, lastMonthReservations]);

    const indicatorClass = isUndefined(change) || change === 0 ? "text-warning" : change > 0 ? "text-success" : "text-danger";
    const indicatorPrepend = isUndefined(change) ? "" : change === 0 ? "~" : change > 0 ? "+" : "";

    return <Minicard
        description={currentReservations}
        headline="Month Reservations"
        indicator={<div className="relative">
            <Tooltip content="Compared to last month" closeDelay={0} placement="right" className="cursor-pointer" showArrow>
                <p className={`${indicatorClass} text-xs cursor-default`}>{indicatorPrepend}{change}%</p>
            </Tooltip>
        </div>}
        icon={<TableClockIcon />}
    />;
}