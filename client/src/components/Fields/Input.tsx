import type { ReactElement } from "react";
import { Input } from "@heroui/react";
import type { RegisterOptions } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { ControlledInputProps } from "@components/Fields/types";

export default function InputField(props: ControlledInputProps): ReactElement {
    const { name, defaultValue, isRequired, rules, maxLength, minLength, label, ...otherProps } = props;
    const methods = useFormContext();

    const { validate, ...restRules } = rules || {};

    const defaultRules: RegisterOptions = {
        ...restRules,
        ...(maxLength && !minLength && { maxLength: {
            message: `${label} cannot exceed ${maxLength} characters.`,
            value: maxLength
        } }),
        ...(minLength && !maxLength && { minLength: {
            message: `${label} cannot be less than ${maxLength} characters.`,
            value: minLength
        } }),

        required: {
            message: "This field is required",
            value: isRequired ? isRequired : false
        },

        validate: {
            ...validate,
            ...(minLength && maxLength && {
                range: (value: string) => value.length >= minLength && value.length <= maxLength ? true : `${label} length must be between ${minLength} and ${maxLength} characters.` })
        }
    }

    return (
        <Controller
            control={methods.control}
            name={name}
            rules={defaultRules}
            defaultValue={defaultValue}
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error, invalid } }) => (
                <Input
                    {...otherProps}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    defaultValue={value}
                    value={value}
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    isRequired={isRequired}
                    label={label}
                />
            )}
        />
    );
}