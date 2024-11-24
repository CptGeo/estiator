import type { ReactElement } from "react";
import InputField from "@components/Fields/Input";
import type { RegisterOptions } from "react-hook-form";
import type { ControlledInputProps } from "@components/Fields/types";
import MailIcon from "@components/Icons/MailIcon";

export default function EmailField(props: Omit<ControlledInputProps, "type">): ReactElement {
  const defaultRules: RegisterOptions = {
    pattern: {
      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
      message: "Please provide a valid email",
    },
  };

  return (
    <InputField
      endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
      {...props}
      type="email"
      rules={defaultRules}
    />
  );
}
