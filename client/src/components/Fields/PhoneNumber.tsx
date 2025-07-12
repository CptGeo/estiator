import type { ReactElement } from "react";
import type { ControlledInputProps } from "@components/Fields/types";
import NumberField from "./Number";

export default function PhoneNumberField(props: Omit<ControlledInputProps, "type">): ReactElement {
    const { label, ...otherProps } = props;

    return <NumberField {...otherProps} label={label} maxLength={15} minLength={6} />;
}