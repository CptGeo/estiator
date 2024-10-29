import { Select } from "@nextui-org/react";
import { ReactElement } from "react";
import { Controller } from "react-hook-form";
import { ControlledSelectProps } from "./types";

export default function SelectField(props: ControlledSelectProps): ReactElement {
  const { children, defaultSelectedKeys, name, ...rest } = props;

  return (
    <Controller defaultValue={defaultSelectedKeys} name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      return <Select
        {...rest}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        value={value}
        defaultSelectedKeys={[value]}
        >{children}</Select>
    } } />
  );
}
