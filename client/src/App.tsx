import { ReactElement } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import MainLayout from "./layouts/Main";
import ReservationPage from "./pages/Reservation/Reservation";
import ApplicationLayout from "./layouts/Application";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <ApplicationLayout />,
    children: [
      {
        path: "reserve",
        element: <ReservationPage />,
      },
    ],
  },
]);

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}