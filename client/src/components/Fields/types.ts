import type { InputProps } from "@heroui/input";
import type { SelectProps } from "@heroui/react";
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