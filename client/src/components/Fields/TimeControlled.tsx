import { Controller } from "react-hook-form";
import type { TimeInputProps } from "@heroui/react";
import { TimeInput } from "@heroui/react";

export default function TimeControlled(props: TimeInputProps & { name: string }) {
  const { children, name, defaultValue, ...rest } = props;

  return (
    <Controller defaultValue={defaultValue} name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      return <TimeInput
        {...rest}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        value={value}>{children}</TimeInput>
    } } />
  );
}