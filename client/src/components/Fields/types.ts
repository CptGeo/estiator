import { InputProps } from "@nextui-org/input";
import { RegisterOptions } from "react-hook-form";

export type ControlledInputProps = {
  name: string;
  label: string;
  rules?: RegisterOptions;
} & InputProps;