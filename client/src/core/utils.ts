import { FieldValues, FormState } from "react-hook-form";

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