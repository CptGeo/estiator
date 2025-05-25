import type { ReactElement } from "react";
import { StrictMode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashboardPage from "@pages/Dashboard/Dashboard";
import PrivateLayout from "@layouts/Private/Private";
import LoginPage from "@pages/Login/Login";
import AuthLayout from "@layouts/Auth";
import ReservationsManagementPage from "@pages/ReservationsManagement/ReservationsManagement";
import TablesManagementPage from "@pages/TablesManagement/TablesManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmployeesManagementPage from "@pages/EmployeesManagement/EmployeesManagement";
import EmployeeDetails from "@pages/EmployeesManagement/EmployeeDetails/EmployeeDetails";
import RegisterPage from "@pages/Register/Register";
import Unauthorized from "@pages/Errors/Unauthorized";
import UnauthorizedOnlyLayout from "@layouts/UnauthorizedOnly";
import CommonLayout from "@layouts/Common";
import { UserRole } from "@core/types";
import NotificationProvider from "@context/Notification";
import CustomerManagementPage from "@pages/CustomerManagement/CustomerManagement";
import SettingsPage from "@pages/Settings/Settings";
import CancellationPage from "@pages/Cancellation/Cancellation";
import CreateReservationPage from "@pages/CreateReservation/CreateReservation";
import ClientSettings from "@pages/ClientSettings/ClientSettings";
import ClientReservations from "@pages/ClientReservations/ClientReservations";
import { allRoutes, Routes } from "@core/utils";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'admin',
        element: <PrivateLayout permissions={[UserRole.ADMIN, UserRole.MODERATOR]} />,
        children: [
          {
            path: "",
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
            path: "customers-management",
            element: <CustomerManagementPage />
          },
          {
            path: "settings",
            element: <SettingsPage />
          },
        ],
      },
      {
        element: <PrivateLayout permissions={[UserRole.ADMIN]} />,
        path: "admin",
        children: [
          {
            path: "employees-management",
            element: <EmployeesManagementPage />
          },
          {
            path: "employees-management/:id",
            element: <EmployeeDetails />
          },
        ]
      },
      {
        element: <PrivateLayout permissions={[UserRole.CLIENT]} />,
        path: "client",
        children: [
          {
            path: "settings",
            element: <ClientSettings />
          },
          {
            path: "reservations",
            element: <ClientReservations />
          },
          {
            path: "create-reservation",
            element: <CreateReservationPage />
          },
        ]
      },
      {
        element: <UnauthorizedOnlyLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          }
        ]
      },
      {
        element: <CommonLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to={allRoutes[Routes.HOME]} />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/unauthorized",
            element: <Unauthorized />
          },
          {
            path: "/cancelReservation",
            element: <CancellationPage />
          },
          {
            path: "create-reservation",
            element: <CreateReservationPage />
          },
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient();

export default function App(): ReactElement {
  return <StrictMode>
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </NotificationProvider>
  </StrictMode>
}
