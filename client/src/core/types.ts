/** Represents type for the key of sequential data (e.g. arrays) */
export type Key = string | number;

/** Represents a type for times of business operations and availability */
export type OperationalTime = {
  key: Key;
  hour: number;
  minute: number;
}
