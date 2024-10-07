import { ReactElement } from "react";
import InputField from "./Input";
import { RegisterOptions } from "react-hook-form";

type Props = {
    isRequired?: boolean;
    label: string;
    max?: number;
    min?: number;
    name: string;
}

export default function NumberField(props: Props): ReactElement { 

    const defaultRules: RegisterOptions = {
        valueAsNumber: true,
        validate: (value: unknown) => {
            return Number.isNaN(value) ? "Please provide a valid numeric value": true;
        }
    }

    return <InputField {...props} type="email" rules={defaultRules} />;
}