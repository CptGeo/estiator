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
import PasswordResetPage from "@pages/PasswordReset/PasswordReset";
import ResetPasswordPage from "@pages/ResetPassword/ResetPassword";

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
            path: "reservations",
            element: <ReservationsManagementPage />
          },
          {
            path: "tables",
            element: <TablesManagementPage />
          },
          {
            path: "customers",
            element: <CustomerManagementPage />
          },
          {
            path: "settings",
            element: <SettingsPage />
          },
          {
            path: "reservations/create",
            element: <CreateReservationPage />
          },
        ],
      },
      {
        element: <PrivateLayout permissions={[UserRole.ADMIN]} />,
        path: "admin",
        children: [
          {
            path: "employees",
            element: <EmployeesManagementPage />
          },
          {
            path: "employees/:id",
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
            path: "reservations/create",
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
          },
          {
            path: allRoutes[Routes.PASSWORD_RESET],
            element: <PasswordResetPage />,
          },
          {
            path: allRoutes[Routes.RESET_PASSWORD],
            element: <ResetPasswordPage />,
          },
          {
            path: "/reservations/create",
            element: <CreateReservationPage />
          },
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
