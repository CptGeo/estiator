import type { ReactElement } from "react";
import { useState } from "react";
import { Input } from "@heroui/react";
import type { RegisterOptions } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { getError, hasError } from "@core/utils";
import type { ControlledInputProps } from "@components/Fields/types";
import { EyeSlashFilledIcon } from "@components/Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@components/Icons/EyeFilledIcon";

/**
 * @todo Implement password validation
 */
export default function PasswordField(props: Omit<ControlledInputProps, "type">): ReactElement {
    const { name, isRequired, rules, ...otherProps } = props;
    const { register, formState } = useFormContext();
    const [ isVisible, setIsVisible ] = useState(false);

    const defaultRules: RegisterOptions = {
        ...rules,
        required: {
            message: "This field is required",
            value: isRequired ? isRequired : false
        }
    }

    function toggleVisibility(): void {
        setIsVisible(!isVisible);
    }

    return (
        <Input
            {...otherProps}
            {...register(name, defaultRules)}
            isRequired={isRequired}
            isInvalid={hasError(formState, name)}
            errorMessage={getError(formState, name)}
            type={isVisible ? "text" : "password"}
            endContent={
                <button className="focus:outline-none cursor-pointer" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }

        />
    );
}