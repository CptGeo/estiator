import { FieldValues, FormState } from "react-hook-form";
import { UserData } from "./types";

/**
 * Checks if field has any errors
 * @param formState the formState object of the form
 * @param fieldName the field name
 * @returns `true` is field has error, `false` otherwise
 */
export function hasError<T extends FieldValues>(formState: FormState<T>, fieldName: string): boolean {
    return fieldName in formState.errors;
}

/**
 * Gets the error message if it exists
 * @param formState
 * @param fieldName
 * @returns the error message or `undefined`
 */
export function getError<T extends FieldValues>(formState: FormState<T>, fieldName: string): string | undefined {
    if (hasError<T>(formState, fieldName)) {
        return formState.errors[fieldName]?.message as string;
    }
}

export function sleep(ms: number): Promise<number> {
    return new Promise((r) => setTimeout(r, ms));
}

export function getFullName(user: UserData): string {
    return `${user.name} ${user.surname}`;
}

/**
 * Ensures that the thrown value is indeed an Error. Converts it to Error if it is not.
 */
export function ensureErr(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }

    let stringified = '[Unable to stringify the thrown value]';
    try {
        stringified = JSON.stringify(value);
    } catch {
        // no need to handle catch; use default stringified message
    }

    const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`);
    return error;
}