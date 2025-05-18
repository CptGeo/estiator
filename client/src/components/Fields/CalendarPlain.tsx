import type { CalendarProps } from "@heroui/react";
import { Calendar } from "@heroui/react";
import { Controller } from "react-hook-form";

type Props = {
    name: string;
    required?: boolean;
} & Omit<CalendarProps, "value" | "onChange" | "onBlur" >;

export default function CalendarPlainField(props: Props) {
    const { name, defaultValue, required = false, ...calendarProps } = props;

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            rules={{ required }}
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