import type { CheckboxProps } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
} & CheckboxProps;

export default function CheckboxField(props: Props) {
  const { name, label, ...otherProps } = props;
  const { register } = useFormContext();

  return <Checkbox {...otherProps} {...register(name)}>{label}</Checkbox>
}