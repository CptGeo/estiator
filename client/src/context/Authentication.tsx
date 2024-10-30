import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { client } from "../core/request";
import { useNavigate } from "react-router-dom";
import { ensureErr, sleep } from "../core/utils";
import { AxiosError } from "axios";
import { AuthValue, Credentials, UserData } from "../core/types";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider( props: PropsWithChildren ) {
  const [user, setUser] = useState<UserData | null>();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // get token and user
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    // if both the token and user are present, initialize authenticated state
    if (t && u) {
      setUser(JSON.parse(u));
      setToken(t);
    }
  }, []);

  async function loginAction(credentials: Credentials): Promise<void> {
    try {
      setLoading(true);
      await sleep(1500);
      // perform request
      const response = await client.post("/auth/login", credentials);

      // set user and token state
      setUser(response.data.data.user);
      setToken(response.data.data.token);

      // save user and token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);

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
      // empty state
      setUser(null);
      setToken(null);

      // remove all locally saved data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

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