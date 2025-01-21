import type { ReactElement } from "react";
import { Input } from "@nextui-org/react";
import type { RegisterOptions } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { getError, hasError } from "@core/utils";
import type { ControlledInputProps } from "@components/Fields/types";

export default function InputField(props: ControlledInputProps): ReactElement {
    const { name, isRequired, rules, maxLength, minLength, label, ...otherProps } = props;
    const { register, formState } = useFormContext();

    const { validate, ...restRules } = rules || {};

    const defaultRules: RegisterOptions = {
        ...restRules,
        ...maxLength && !minLength && { maxLength: {
            message: `${label} cannot exceed ${maxLength} characters.`,
            value: maxLength
        } },
        ...minLength && !maxLength && { minLength: {
            message: `${label} cannot be less than ${maxLength} characters.`,
            value: minLength
        } },

        required: {
            message: "This field is required",
            value: isRequired ? isRequired : false
        },

        validate: {
            ...validate,
            ...minLength && maxLength && {
                range: (value: string) => value.length >= minLength && value.length <= maxLength ? true : `${label} length must be between ${minLength} and ${maxLength} characters.` }
        }
    }

    return (
        <Input
            {...otherProps}
            {...register(name, defaultRules)}
            label={label}
            isRequired={isRequired}
            isInvalid={hasError(formState, name)}
            errorMessage={getError(formState, name)}
        />
    );
}