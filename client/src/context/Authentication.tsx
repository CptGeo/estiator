import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react"
import { client } from "@core/request";
import { useNavigate } from "react-router-dom";
import { ensureErr, sleep } from "@core/utils";
import { AxiosError } from "axios";
import type { AuthValue, Credentials, UserData } from "@core/types";
import useLocalStorage from "@hooks/useLocalStorage";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider( props: PropsWithChildren ) {
  const [token, setToken] = useLocalStorage<string>("token");
  const [user, setUser] = useLocalStorage<UserData>("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      setLoading(true);
      await sleep(1500);
      // perform request
      const response = await client.post("/auth/login", credentials);

      setUser(response.data.data.user);
      setToken(response.data.data.token);

    } catch (err) {
      /** @todo Notify for failed login */
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
      // remove all locally saved data
      setUser(null);
      setToken(null);

      // go to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      /** @todo Notify for failed logout */
    }
  }

  return <AuthContext.Provider value={{ user, token, loading, loginAction, logoutAction }}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};