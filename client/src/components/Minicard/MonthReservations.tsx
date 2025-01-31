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

    const { data: currentReservations } = useQueryReservations<number>(3000, { params: { count: true, dateFrom: currMonthStart, dateTo: currMonthEnd.toString() } });
    const { data: lastMonthReservations } = useQueryReservations<number>(3000, { params: { count: true, dateFrom: prevMonthStart, dateTo: prevMonthEnd.toString() } });

    const change = useMemo(() => {
        if (!isUndefined(currentReservations) && isInteger(currentReservations) && !isUndefined(lastMonthReservations) && isInteger(lastMonthReservations)) {
            const diff = currentReservations - lastMonthReservations;
            const percentage = (diff / currentReservations) * 100;
            return Number(percentage.toFixed(1));
        }
    }, [currentReservations, lastMonthReservations]);

    const indicatorClass = !change ? "text-warning" : change > 0 ? "text-success" : "text-danger";
    const indicatorPrepend = !change ? "-" : change === 0 ? "~" : change > 0 ? "+" : "";

    return <Minicard
        description={currentReservations}
        headline="Month Reservations"
        indicator={<div className="relative">
            <Tooltip content="Increase compared to last month" closeDelay={0} placement="right" className="cursor-pointer" showArrow>
                <p className={`${indicatorClass} text-xs cursor-default`}>{indicatorPrepend}{change}%</p>
            </Tooltip>
        </div>}
        icon={<TableClockIcon />}
    />;
}