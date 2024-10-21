import { ReactElement } from "react";
import InputField from "./Input";
import { RegisterOptions } from "react-hook-form";
import { ControlledInputProps } from "./types";
import { MailIcon } from "../Icons/MailIcon";

export default function EmailField(props: Omit<ControlledInputProps, "type">): ReactElement {
  const defaultRules: RegisterOptions = {
    pattern: {
      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
      message: "Please provide a valid email",
    },
  };

  return (
    <InputField
      endContent={
        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      }
      {...props}
      type="email"
      rules={defaultRules}
    />
  );
}
