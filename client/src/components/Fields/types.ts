import type { InputProps } from "@heroui/input";
import type { AutocompleteProps, SelectProps } from "@heroui/react";
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

export type ControlledAutocompleteProps = {
  name: string;
  label?: string;
  rules?: RegisterOptions;
} & AutocompleteProps;