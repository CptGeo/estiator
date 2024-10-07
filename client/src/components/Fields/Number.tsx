import { ReactElement } from "react";
import InputField from "./Input";
import { RegisterOptions } from "react-hook-form";
import { ControlledInputProps } from "./types";

export default function NumberField(props: Omit<ControlledInputProps, "type">): ReactElement { 

    const defaultRules: RegisterOptions = {
        valueAsNumber: true,
        validate: (value: unknown) => {
            return Number.isNaN(value) ? "Please provide a valid numeric value": true;
        }
    }

    return <InputField {...props} type="text" rules={defaultRules} />;
}