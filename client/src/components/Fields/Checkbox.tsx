import type { CheckboxProps } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
} & CheckboxProps;

export default function CheckboxField(props: Props) {
  const { name, label, value, defaultSelected, ...otherProps } = props;
  const { register, getValues, formState: { defaultValues } } = useFormContext();
  const options = register(name);

  function isChecked(v: boolean | Array<string | (readonly string[] & string) | undefined>) {
    if (Array.isArray(v)) {
      return v.includes(value);
    }
    return Boolean(v);
  }

  return <Checkbox
    {...otherProps}
    {...options}
    value={value}
    defaultSelected={isChecked(defaultValues?.[name]) || defaultSelected}
    checked={isChecked(getValues()?.[name])}>{label}</Checkbox>
}