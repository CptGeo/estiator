import type { CheckboxProps } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
} & CheckboxProps;

export default function CheckboxField(props: Props) {
  const { name, label, value, ...otherProps } = props;
  const { register, getValues, formState: { defaultValues } } = useFormContext();

  const options = register(name);
  return <Checkbox
    {...otherProps}
    {...options}
    value={value}
    defaultSelected={defaultValues?.[name] && defaultValues?.[name].includes(value)}
    checked={getValues()?.[name] && getValues()?.[name].includes(value)}>{label}</Checkbox>
}