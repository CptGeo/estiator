import { Select } from "@nextui-org/react";
import { ReactElement } from "react";
import { Controller } from "react-hook-form";
import { ControlledSelectProps } from "./types";

export default function SelectField(props: ControlledSelectProps): ReactElement {
  const { children, name, ...rest } = props;

  return (
    <Controller name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      return <Select
        {...rest}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        value={value}
        >{children}</Select>
    } } />
  );
}
