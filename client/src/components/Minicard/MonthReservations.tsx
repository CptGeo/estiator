import useQueryReservations from "@hooks/useQueryReservations"
import Minicard from "./Minicard";
import TableClockIcon from "@components/Icons/TableClockIcon";
import { endOfMonth, startOfMonth, today } from "@internationalized/date";
import { useMemo } from "react";
import { isInteger, isUndefined } from "@core/utils";
import { Tooltip } from "@heroui/react";

export default function MonthReservations() {
    const t = today("Europe/Athens");
    const currMonthEnd = endOfMonth(t);
    const currMonthStart = startOfMonth(t);
    const prevMonthEnd = endOfMonth(t.subtract({ months: 1 }))
    const prevMonthStart = startOfMonth(t.subtract({ months: 1 }))

    const { data: currentReservations } = useQueryReservations<number>(3000, { count: true, dateFrom: currMonthStart.toString(), dateTo: currMonthEnd.toString() });
    const { data: lastMonthReservations } = useQueryReservations<number>(3000, { count: true, dateFrom: prevMonthStart.toString(), dateTo: prevMonthEnd.toString() });
    const change = useMemo(() => {
        if (!isUndefined(currentReservations) && isInteger(currentReservations) && !isUndefined(lastMonthReservations) && isInteger(lastMonthReservations)) {
            const multiplier = currentReservations > lastMonthReservations ? 100 : -100;
            const largest = Math.max(Math.abs(currentReservations), Math.abs(lastMonthReservations));
            const smallest = Math.min(Math.abs(currentReservations), Math.abs(lastMonthReservations));

            if (smallest === 0) { return largest * multiplier }

            const diff = largest - smallest;
            const percentage = (diff / (smallest)) * multiplier;
            return Number(percentage.toFixed(1));
        }
    }, [currentReservations, lastMonthReservations]);

    const indicatorClass = !change ? "text-warning" : change > 0 ? "text-success" : "text-danger";
    const indicatorPrepend = isUndefined(change) ? "-" : change > 0 ? "+" : "";

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