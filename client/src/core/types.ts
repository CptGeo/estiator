/** Represents type for the key of sequential data (e.g. arrays) */
export type Key = string | number;

/** Represents a type that is extended by all types that have `id` */
export type HasId = { id: Key };

/** Represents a type for times of business operations and availability */
export type OperationalTime = {
  key: Key;
  hour: number;
  minute: number;
};

/** Represents the useAuth hook return object */
export type AuthValue = {
  /** @property authentication token stored in localStorage */
  token?: string | null;

  /** @property user data stored in localStorage  */
  user?: UserData | null | undefined;

  /** @property `true` if user is authenticating, `false` otherwise */
  loading?: boolean;

  /** @property method for logging in user with given Credentials */
  loginAction: (_credentials: Credentials) => Promise<void>;

  /** @property method for logging out current user */
  logoutAction: () => Promise<void>;
};

/** Represents the username and password credentials for logging in a user */
export type Credentials = {
  username: string;
  password: string;
};

/** Represent the returned user data after a user has logged in */
export type UserData = {
  username?: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  registered: boolean;
};

export interface EmployeeData extends HasId {
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  role: Role;
  profileImage: string;
  registrationDate: string;
  position: string;
  status: EmployeeStatus;
  tables: string[]; // temporary table ids
};

export enum EmployeeStatus {
  ACTIVE = "active",
  ON_LEAVE = "on_leave",
  TERMINATED = "terminated"
};

export const EmployeeStatuses = {
  [EmployeeStatus.ACTIVE]: "Active",
  [EmployeeStatus.ON_LEAVE]: "On Leave",
  [EmployeeStatus.TERMINATED]: "Terminated"
};

export enum Role {
  MANAGER = "manager",
  EMPLOYEE = "employee"
};

/** Todo: Replace with i18n */
export const Roles = {
  [Role.MANAGER]: "Manager",
  [Role.EMPLOYEE]: "Employee",
};

/** Represents company related information */
export type CompanyData = {
  name: string;
  description: string;
};

/** Represents statuses of reservations */
export enum ReservationStatus {
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  PENDING = "pending",
  CONFIRMED = "confirmed"
};

/** Represents reservation data */
export interface ReservationData extends HasId {
  date: string, // "YYYY-MM-DD"
  time: string,
  user: UserData,
  status: ReservationStatus,
  persons: number,
  table: TableData
};

/** Represents table data */
export interface TableData extends HasId {
  label: string;
  capacity: number,
  x: number,
  y: number,
  color: string
};

/**
 * Utility type to use when representing data as normalized data (hashmap)
 */
export type Normalized<T> = Record<string | number, T>;

export type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;