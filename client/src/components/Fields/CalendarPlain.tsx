import { Calendar, CalendarProps } from "@nextui-org/react";
import { Controller } from "react-hook-form";

type Props = {
    name: string;
} & Omit<CalendarProps, "value" | "onChange" | "onBlur" >;

export default function CalendarPlainField(props: Props) {
    const { name, ...calendarProps } = props;

    return (
        <Controller
            name={name}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <Calendar
                    {...calendarProps}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    onBlur={onBlur}
                    />
            )}
        />
    );
}