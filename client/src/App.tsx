import { ReactElement, StrictMode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import PrivateLayout from "./layouts/Private/Private";
import LoginPage from "./pages/Login/Login";
import MainLayout from "./layouts/Main";
import AuthLayout from "./layouts/Auth";
import ReservationsManagementPage from "./pages/ReservationsManagement/ReservationsManagement";
import TablesManagementPage from "./pages/TablesManagement/TablesManagement";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "reservations-management",
            element: <ReservationsManagementPage />
          },
          {
            path: "tables-management",
            element: <TablesManagementPage />
          }
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          }
        ]
      }
    ]
  }
]);

export default function App(): ReactElement {
  return <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
}
