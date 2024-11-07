import type { InputProps } from "@nextui-org/input";
import type { SelectProps } from "@nextui-org/react";
import type { RegisterOptions } from "react-hook-form";

export type ControlledInputProps = {
  name: string;
  label?: string;
  rules?: RegisterOptions;
} & InputProps;

export type ControlledSelectProps = {
  name: string;
  label?: string;
  rules?: RegisterOptions;
} & SelectProps;