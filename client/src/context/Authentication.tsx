import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react"
import { client } from "@core/request";
import { useNavigate } from "react-router-dom";
import { ensureErr } from "@core/utils";
import { AxiosError } from "axios";
import type { AuthValue, Credentials } from "@core/types";
import useLocalStorage from "@hooks/useLocalStorage";
import { decryptJwt } from "@core/auth";
import { useNotification } from "./Notification";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider( props: PropsWithChildren ) {
  const [token, setToken, removeToken] = useLocalStorage<string>("token");
  const user = token ? decryptJwt(token).user : null;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notify } = useNotification();

  // verify user data with server
  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      setLoading(true);
      const response = await client.post("/auth/login", credentials);

      if (response?.status !== 200) {
        throw new Error("Invalid email or password");
      }

      setToken(response.data.token);
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
    } finally {
      setLoading(false);
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

  return <AuthContext.Provider value={{ user, token, loading, loginAction, logoutAction }}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};