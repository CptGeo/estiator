import { ReactElement, StrictMode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import PrivateLayout from "./layouts/Private/Private";
import PlaygroundPage from "./pages/Playground/Playground";
import LoginPage from "./pages/Login/Login";
import MainLayout from "./layouts/Main";
import AuthLayout from "./layouts/Auth";

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
            path: "playground",
            element: <PlaygroundPage />,
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
