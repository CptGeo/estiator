import type { RangeCalendarProps } from "@nextui-org/react";
import { RangeCalendar } from "@nextui-org/react";
import { Controller } from "react-hook-form";

type Props = {
    name: string;
} & Omit<RangeCalendarProps, "value" | "onChange" | "onBlur" >;

export default function RangeCalendarField(props: Props) {
    const { name, defaultValue, ...calendarProps } = props;

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <RangeCalendar
                    {...calendarProps}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                    isInvalid={!!error?.message}
                />
            )}
        />
    );
}