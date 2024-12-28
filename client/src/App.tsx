import type { ReactElement } from "react";
import { StrictMode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "@pages/Dashboard/Dashboard";
import PrivateLayout from "@layouts/Private/Private";
import LoginPage from "@pages/Login/Login";
import MainLayout from "@layouts/Main";
import AuthLayout from "@layouts/Auth";
import ReservationsManagementPage from "@pages/ReservationsManagement/ReservationsManagement";
import TablesManagementPage from "@pages/TablesManagement/TablesManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmployeesManagementPage from "@pages/EmployeesManagement/EmployeesManagement";
import EmployeeDetails from "@pages/EmployeesManagement/EmployeeDetails/EmployeeDetails";
import RegisterPage from "@pages/Register/Register";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "reservations-management",
            element: <ReservationsManagementPage />
          },
          {
            path: "tables-management",
            element: <TablesManagementPage />
          },
          {
            path: "employees-management",
            element: <EmployeesManagementPage />
          },
          {
            path: "employees-management/:id",
            element: <EmployeeDetails />
          }
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          }
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient();

export default function App(): ReactElement {
  return <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
}
