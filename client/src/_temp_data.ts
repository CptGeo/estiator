const columns = [
  { name: "NAME", uid: "name" },
  { name: "DATE", uid: "date" },
  { name: "TIME", uid: "time" },
  { name: "TABLE", uid: "table" },
  { name: "ACTIONS", uid: "actions" },
];

const reservations = [
    {
      id: 1,
      date: "12-10-2024",
      time: "13:30:00",
      user: {
        name: "George Kalyvianakis",
        email: "george@gmail.com",
        phone: "+306912345678"
      },
      persons: 4,
      table: 1
    },
    {
      id: 2,
      date: "12-10-2024",
      time: "15:30:00",
      user: {
        name: "Jack Sparrow",
        email: "jack@blackpearl.com",
        phone: "+306912345678"
      },
      persons: 2,
      table: 5
    },
    {
      id: 3,
      date: "12-10-2024",
      time: "18:30:00",
      user: {
        name: "John Snow",
        email: "john@snow.com",
        phone: "+306912345678"
      },
      persons: 2,
      table: 3
    }
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

export type UsersType = typeof users[0];
export type ReservationsType = typeof reservations[0];

export { columns, users, reservations };