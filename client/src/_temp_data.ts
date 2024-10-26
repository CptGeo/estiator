import { ReservationData } from "./core/types";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DATE", uid: "date" },
  { name: "TIME", uid: "time" },
  { name: "TABLE", uid: "table" },
  { name: "PERSONS", uid: "persons" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const reservations: Iterable<ReservationData> = [
    {
      id: 1,
      date: "2024-12-10",
      time: "13:30:00",
      user: {
        name: "George",
        surname: "Kalyvianakis",
        email: "george@gmail.com",
        phone: "+306912345678"
      },
      status: "completed",
      persons: 4,
      table: 1
    },
    {
      id: 2,
      date: "2024-11-10",
      time: "15:30:00",
      user: {
        name: "Jack",
        surname: "Sparrow",
        email: "jack@blackpearl.com",
        phone: "+306912345678"
      },
      status: "confirmed",
      persons: 2,
      table: 5
    },
    {
      id: 3,
      date: "2024-11-12",
      time: "18:30:00",
      user: {
        name: "John",
        surname: "Snow",
        email: "john@snow.com",
        phone: "+306912345678"
      },
      status: "cancelled",
      persons: 2,
      table: 3
    },
    {
      id: 4,
      date: "2024-11-13",
      time: "18:30:00",
      user: {
        name: "Peter",
        surname: "Jackson",
        email: "peter@jackson.com",
        phone: "+306912345678"
      },
      status: "pending",
      persons: 2,
      table: 3
    }
];

export { columns, reservations };