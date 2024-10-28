/** Represents type for the key of sequential data (e.g. arrays) */
export type Key = string | number;

/** Represents a type for times of business operations and availability */
export type OperationalTime = {
  key: Key;
  hour: number;
  minute: number;
}

/** Represents the useAuth hook return object */
export type AuthValue = {
  /** @property authentication token stored in localStorage */
  token?: string | null;

  /** @property user data stored in localStorage  */
  user?: UserData | null;

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
}

/** Represent the returned user data after a user has logged in */
export type UserData = {
  username?: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  registered: boolean;
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
}

/** Represents reservation data */
export type ReservationData = {
  id: string | number,
  date: string, // "YYYY-MM-DD"
  time: string,
  user: UserData,
  status: ReservationStatus,
  persons: number,
  table: string
};
