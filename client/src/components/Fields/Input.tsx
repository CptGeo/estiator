import { ReactElement } from "react";
import { Input } from "@nextui-org/react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { getError, hasError } from "../../core/utils";
import { ControlledInputProps } from "./types";


export default function InputField(props: ControlledInputProps): ReactElement {
    const { name, isRequired, rules, ...otherProps } = props;
    const { register, formState } = useFormContext();

    const defaultRules: RegisterOptions = {
        ...rules,
        required: {
            message: "This field is required",
            value: isRequired ? isRequired : false
        }
    }

    return (
        <Input 
            {...otherProps} 
            {...register(name, defaultRules)}
            isRequired={isRequired}
            isInvalid={hasError(formState, name)}
            errorMessage={getError(formState, name)} 
        />
    );
}