import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react"
import { client } from "@core/request";
import { useNavigate } from "react-router-dom";
import { ensureErr } from "@core/utils";
import { AxiosError } from "axios";
import type { AuthValue, Credentials } from "@core/types";
import useLocalStorage from "@hooks/useLocalStorage";
import { decryptJwt } from "@core/auth";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider( props: PropsWithChildren ) {
  const [token, setToken, removeToken] = useLocalStorage<string>("token");
  const user = token ? decryptJwt(token).user : null;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // verify user data with server
  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      setLoading(true);
      const response = await client.post("/auth/login", credentials);

      if (response.status !== 200) {
        throw new Error("Invalid response from server");
      }

      setToken(response.data.token);

    } catch (err) {
      let message = "";
      if (err instanceof AxiosError) {
        message = err.response ? err.response.data.message : err.message;
      } else {
        const error = ensureErr(err);
        message = error.message;
      }
      console.error(err);
      navigate("/login", { replace: true, state: message });
    } finally {
      setLoading(false);
    }
  };

  async function logoutAction(): Promise<void> {
    try {
      removeToken();

      // go to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  }

  return <AuthContext.Provider value={{ user, token, loading, loginAction, logoutAction }}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};