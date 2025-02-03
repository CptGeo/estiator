import type { ReactElement } from "react";
import InputField from "@components/Fields/Input";
import type { RegisterOptions } from "react-hook-form";
import type { ControlledInputProps } from "@components/Fields/types";

export default function NumberField(props: Omit<ControlledInputProps, "type">): ReactElement {
    const { max, min, label, ...otherProps } = props;

    const defaultRules: RegisterOptions = {
        valueAsNumber: true,
        ...max && { max: {
            message: `${label} cannot be greater than ${max}.`,
            value: max
        } },
        ...min && { min: {
            message: `${label} cannot be less than ${min}.`,
            value: min
        } },
        validate: {
            isNumeric: (value: unknown) => {
                return isNaN(Number(value)) ? "Please provide a valid numeric value" : true;
            }
        }
    }

    return <InputField {...otherProps} type="text" label={label} rules={defaultRules} />;
}