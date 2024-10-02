import { ReactElement } from "react";
import InputField from "./Input";
import { RegisterOptions } from "react-hook-form";

type Props = {
    label: string;
    name: string;
    isRequired?: boolean;
}

export default function EmailField(props: Props): ReactElement {

    const defaultRules: RegisterOptions = {
        pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
            message: "Please provide a valid email"
        }
    }

    return <InputField {...props} type="email" rules={defaultRules} />;
}