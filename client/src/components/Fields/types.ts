import { InputProps } from "@nextui-org/input";
import { SelectProps } from "@nextui-org/react";
import { RegisterOptions } from "react-hook-form";

export type ControlledInputProps = {
  name: string;
  label: string;
  rules?: RegisterOptions;
} & InputProps;

export type ControlledSelectProps = {
  name: string;
  label: string;
  rules?: RegisterOptions;
} & SelectProps;