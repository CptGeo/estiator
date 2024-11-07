import type { ReactElement } from "react";
import InputField from "@components/Fields/Input";
import type { RegisterOptions } from "react-hook-form";
import type { ControlledInputProps } from "@components/Fields/types";

export default function NumberField(props: Omit<ControlledInputProps, "type">): ReactElement {

    const defaultRules: RegisterOptions = {
        valueAsNumber: true,
        validate: (value: unknown) => {
            return Number.isNaN(value) ? "Please provide a valid numeric value": true;
        }
    }

    return <InputField {...props} type="text" rules={defaultRules} />;
}