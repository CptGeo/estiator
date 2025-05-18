import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { allRoutes, ensureErr, getRootPage, postReq, Routes, statusError, statusSuccess } from "@core/utils";
import { AxiosError } from "axios";
import type { AuthResponse } from "@core/types";
import { type AuthValue, type Credentials, type ErrorResponse } from "@core/types";
import useLocalStorage from "@hooks/useLocalStorage";
import { decryptJwt } from "@core/auth";
import { useNotification } from "./Notification";
import { useMutation } from "@tanstack/react-query";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider( props: PropsWithChildren ) {
  const [token, setToken, removeToken] = useLocalStorage<string>("token");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (credentials: Credentials) => postReq<AuthResponse | ErrorResponse>("/auth/login", credentials),
  })
  const user = token ? decryptJwt(token).user : null;
  const navigate = useNavigate();
  const { notify } = useNotification();

  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      const response = await mutateAsync(credentials);
      if (statusSuccess(response.status)) {
        setToken((response.data as AuthResponse).token);
        notify({ message: "You have logged in successfully!", type: "success" });
      }

      if (statusError(response.status)) {
        notify({
          message: "Authentication has failed.",
          description: (response.data as ErrorResponse).message,
          type: "danger"
        });
      }

      if (statusSuccess(response.status)) {
        try {
          const claims = 'token' in response.data ? decryptJwt(response.data.token) : null;
          const userRole = claims?.user ? claims.user.userRole : null;
          navigate(getRootPage(userRole));
        } catch (e) {
          console.error('Token could not be parsed: ', e);
        }
      }

    } catch (err) {
      let message = "";
      if (err instanceof AxiosError) {
        message = err.response ? err.response.data.message : err.message;
      } else {
        const error = ensureErr(err);
        message = error.message;
      }
      notify({
        message: "Authentication has failed.",
        description: "Something has gone wrong. Please try again later.",
        type: "danger"
      });
      navigate(allRoutes[Routes.LOGIN], { state: message });
    }
  };

  async function logoutAction(): Promise<void> {
    try {
      removeToken();
      notify({ message: "You have logged out successfully." });

      // go to login page
      navigate(allRoutes[Routes.LOGIN], { replace: true });
    } catch (error) {
      notify({ message: "Logout has failed", description: "Please check your network", type: "danger" });
      console.error(error);
    }
  }

  return <AuthContext.Provider value={{ user, token, loading: isPending, loginAction, logoutAction }}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};