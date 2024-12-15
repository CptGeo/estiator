import { Controller } from "react-hook-form";
import type { TimeInputProps } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";

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