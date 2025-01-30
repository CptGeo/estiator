import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { ensureErr, postReq } from "@core/utils";
import { AxiosError } from "axios";
import type { AuthValue, Credentials } from "@core/types";
import useLocalStorage from "@hooks/useLocalStorage";
import { decryptJwt } from "@core/auth";
import { useNotification } from "./Notification";
import { useMutation } from "@tanstack/react-query";

const AuthContext = createContext<AuthValue | null>(null);

type AuthResponse = { email: string, token: string };

export function AuthProvider( props: PropsWithChildren ) {
  const [token, setToken, removeToken] = useLocalStorage<string>("token");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (credentials: Credentials) => postReq<AuthResponse>("/auth/login", credentials),
  })
  const user = token ? decryptJwt(token).user : null;
  const navigate = useNavigate();
  const { notify } = useNotification();

  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      const response = await mutateAsync(credentials);
      setToken(response.token);
      notify({ message: "You have logged in successfully!", type: "success" });
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
        description: "Please check your credentials and try again.",
        type: "danger"
      });
      navigate("/login", { state: message });
    }
  };

  async function logoutAction(): Promise<void> {
    try {
      removeToken();
      notify({ message: "You have logged out successfully." });

      // go to login page
      navigate("/login", { replace: true });
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