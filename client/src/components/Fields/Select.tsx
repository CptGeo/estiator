import type { ReactElement } from "react";
import { Select } from "@heroui/react";
import { Controller } from "react-hook-form";
import type { ControlledSelectProps } from "@components/Fields/types";
import { isUndefined } from "@core/utils";

export default function SelectField(props: ControlledSelectProps): ReactElement {
  const { children, defaultSelectedKeys, onChange: onChangeCustom, name, ...rest } = props;

  return (
    <Controller defaultValue={defaultSelectedKeys} name={name} render={({ field: { onChange, onBlur, value, ref } }) => {
      const val = !isUndefined(value) ? String(value).split(",") : value;
      return (
        <Select
          {...rest}
          name={name}
          onChange={(e) => {
            onChange(e);
            if (onChangeCustom) {
              onChangeCustom(e);
            }
          }}
          onBlur={onBlur}
          ref={ref}
          selectedKeys={val}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {children}
        </Select>
      );
    } } />
  );
}
