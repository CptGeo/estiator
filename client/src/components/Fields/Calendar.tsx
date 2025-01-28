import type { DateValue } from "@heroui/react";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Controller } from "react-hook-form";

type Props = {
    name: string;
}

export default function CalendarField(props: Props) {
    const { name } = props;
    const tomorrow = today(getLocalTimeZone()).add({ days: 1 });

    /**
     * Example structure to create availabily dates
     * @todo One idea, is to implement filtering properties that can be changed from the business easily to show availability/unavailability
     *
     * @example
     * boolean availableOnlyInPerson
     * boolean fullyReserved
     * etc...
     *
     * With the above, we can have special messages for each condition, on the calendar (e.g. "The restaurant is fully booked for this date")
     * */
    const fetchedData = [
        {
            from: "12-10-2024",
            to: "30-10-2024",
        },
        {
            from: "15-11-2024",
            to: "23-12-2024",
        },
        {
            from: "27-12-2024",
            to: "30-12-2024",
        },
    ]

    const availability = fetchedData.map(item => {
        const fromItemArr = item.from.split("-").map( val => parseInt(val) );
        const toItemArr = item.to.split("-").map( val => parseInt(val) );
        const fromDate = new CalendarDate(fromItemArr[2], fromItemArr[1], fromItemArr[0]);
        const toDate = new CalendarDate(toItemArr[2], toItemArr[1], toItemArr[0]);
        return [fromDate, toDate];
    });

    function findLatestAvailable(dt: DateValue): DateValue {
        return isDateUnavailable(dt) ? findLatestAvailable(dt.add({ days: 1 })) : dt;
    }

    function isDateUnavailable(date: DateValue) {
        return !availability.some((range) => date.compare(range[0]) >= 0 && date.compare(range[1]) <= 0)
    }

    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <Calendar
                    defaultValue={findLatestAvailable(tomorrow)}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    onBlur={onBlur}
                    minValue={tomorrow}
                    isDateUnavailable={isDateUnavailable}
                    />
            )}
        />
    );
}