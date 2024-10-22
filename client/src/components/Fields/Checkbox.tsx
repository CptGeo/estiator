import { Checkbox, CheckboxProps } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
} & CheckboxProps;

export default function CheckboxField(props: Props) {
  const { name, label } = props;
  const { register } = useFormContext();

  return <Checkbox {...register(name)}>{label}</Checkbox>
}