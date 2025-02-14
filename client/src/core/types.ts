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
  email: string;
  password: string;
};

export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  MODERATOR = "ROLE_MODERATOR",
  CLIENT = "ROLE_CLIENT",
  GUEST = "ROLE_GUEST",
  UNKNOWN = "ROLE_UNKNOWN"
};

export const UserRoleName = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.MODERATOR]: "Moderator",
  [UserRole.CLIENT]: "Client",
  [UserRole.GUEST]: "Guest",
  [UserRole.UNKNOWN]: "Unknown"
}

export enum UserStatus {
  ACTIVE = "Active",
  ON_LEAVE = "On_Leave",
  TERMINATED = "Terminated"
}

/** Represent the returned user data after a user has logged in */
export interface UserData extends HasId {
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  position: string;
  profileImage: string;
  status: UserStatus,
  userRole: UserRole;
  createdDate: string;
  tables?: TableData[];
};

export enum ScheduleStatus {
  WORKING = "Working",
  ON_LEAVE = "On_Leave",
  SICK = "Sick"
};

export const ScheduleStatuses = {
  [ScheduleStatus.WORKING]: "Working",
  [ScheduleStatus.ON_LEAVE]: "On Leave",
  [ScheduleStatus.SICK]: "Sick"
};

export interface Schedule extends HasId {
  date: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  user: UserData;
}

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
  tables: string[];
};

export enum EmployeeStatus {
  ACTIVE = "Active",
  ON_LEAVE = "On_Leave",
  TERMINATED = "Terminated"
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

export enum AppSetting {
  BusinessName = "businessName",
  BusinessDescription = "businessDescription"
}

export type SettingsData = Record<AppSetting, string>;

/** Represents statuses of reservations */
export enum ReservationStatus {
  CANCELLED = "Cancelled",
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  BOOKED = "Booked",
  COMPLETED = "Completed"
};

/** Represents reservation data */
export interface ReservationData extends HasId {
  date: string, // "YYYY-MM-DD"
  time: string,
  endTime: string,
  status: ReservationStatus,
  duration: number,
  createdBy: UserData,
  createdFor: UserData,
  persons: number,
  conflicts: number,
  table: TableData
};

/** Represents table data */
export interface TableData extends HasId {
  label: string;
  capacity: number,
  x: number,
  y: number,
  color: string,
  occupied?: boolean,
  user?: Partial<UserData>
};

/**
 * Utility type to use when representing data as normalized data (hashmap)
 */
export type Normalized<T> = Record<string | number, T>;

export type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;

export const Day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export type TokenClaims = {
  sub: string;
  exp: number;
  iat: number;
  user: UserData;
}

export type ErrorResponse = {
  message: string;
  detail: string;
}