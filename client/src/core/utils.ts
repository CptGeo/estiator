import type { FieldValues, FormState } from "react-hook-form";
import { Day, type HasId, type Normalized, type UserData } from "@core/types";
import type { CalendarDate } from "@internationalized/date";
import { CalendarDateTime, parseTime } from "@internationalized/date";
import { client } from "./request";
import type { AxiosRequestConfig } from "axios";

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

export function getInitials(user: UserData): string {
    return `${user.name.charAt(0).toUpperCase()}${user.surname.charAt(0).toUpperCase()}`;
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

/**
 * Returns `true` if data are equal, `false` otherwise.
 */
export function equals(obj1: unknown, obj2: unknown) {
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}

export function isUndefined(value: unknown): value is undefined {
    return typeof value === "undefined";
}

export function isInteger(value: unknown): value is number {
    return Number(value) === value && value % 1 === 0;
}

export function isFloat(value: unknown): value is number {
    return Number(value) === value && value % 1 !== 0;
}

/**
 * Converts a time string into a formatted time string with hours and minutes.
 *
 * @param time - The time string to be parsed, expected in a format that can be parsed by `parseTime`.
 * @returns A string representing the parsed time in "HH:MM" format.
 * @deprecated Will be renamedto `formatTime`
 */
export function toParsedTimeString(time?: string): string {
    if (!time) { return "00:00" }
    return `${parseTime(time).hour.toString().padStart(2, "0")}:${parseTime(time).minute.toString().padStart(2, "0")}`;
}

export function toDurationString(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function parseDurationToSeconds(duration: string): number {
    if (!duration) { return 0; }

    const t = parseTime(duration);
    const SECONDS = 60;
    const MINUTES = 60;
    return (t.hour * MINUTES * SECONDS) + (t.minute * SECONDS) + t.second;
}

/**
 * Constructs and returns the URL of an asset.
 *
 * @param asset - The relative path to the asset.
 * @returns The full URL of the asset.
 */
export function getAssetUrl(asset: string): string {
    return new URL(`${asset.startsWith("/") ? asset : `/${asset}`}`, import.meta.url).href;
}

/**
 * Normalize array to object
 * @param obj The object to be normalized
 */
export function normalize<T extends HasId>(data: T[] | null | undefined) {
    if (isUndefined(data) || data === null) {
        return {};
    }

    const coords: Normalized<T> = {};
    for (const item of data) {
        coords[item.id] = { ...item };
    }
    return coords;
}

export function sortByTimeAscending<T extends { time: string }>(a: T, b: T): number {
    return sortByTime(a, b, "asc");
}

export function sortByTimeDescending<T extends { time: string }>(a: T, b: T): number {
    return sortByTime(a, b, "desc");
}

export function sortByTime<T extends { time: string }>(a: T, b: T, method: "asc" | "desc"): number {
    const aParsed = parseTime(a.time);
    const bParsed = parseTime(b.time);
    const result = aParsed.compare(bParsed);

    return method === "asc" ? result : -result;
}

/**
 * Retrieves data from endpoint using HTTP GET method
 */
export async function getReq<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await client.get<T>(url, config)).data;
};

/**
 * Performs HTTP PUT request
 */
export async function patchReq<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await client.patch<T>(url, data, config)).data;
};

/**
 * Performs HTTP PUT request
 */
export async function postReq<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await client.post<T>(url, data, config)).data;
};

/**
 * Performs HTTP DELETE request
 */
export async function deleteReq<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await client.delete<T>(url, config)).data;
};

/**
 * Parses a timestamp string to a `CalendarDateTime` instance
 */
export function parseTimestamp(timestamp: string): CalendarDateTime {
    const ts = Date.parse(timestamp);
    const date = new Date(ts);
    const parsedDate = new CalendarDateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    return parsedDate;
}

/**
 * Formats CalendarDateTime to `dd-mm-yyyy hh:ss` style
 */
export function formatDateTime(date: CalendarDateTime): string {
    const year = date.year;
    const month = date.month.toString().padStart(2, "0");
    const day = date.day.toString().padStart(2, "0");
    const hour = date.hour.toString().padStart(2, "0");
    const minute = date.minute.toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hour}:${minute}`;
}

/**
 * Formats CalendarDate to `dd/mm/yyyy` style
 */
export function formatDate(date: CalendarDate): string {
    const year = date.year;
    const month = date.month.toString().padStart(2, "0");
    const day = date.day.toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function dayToString(day: number): string {
    if (day > 6 || day < 0) {
        throw new Error("Invalid day of the week");
    }
    return Day[day];
}

