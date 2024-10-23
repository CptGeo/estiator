import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { client } from "../core/request";
import { useNavigate } from "react-router-dom";
import { sleep } from "../core/utils";
import { AxiosError } from "axios";

export type AuthValue = {
  token?: string | null;
  user?: UserData | null;
  loading?: boolean;
  loginAction: (credentials: Credentials) => Promise<void>;
  logoutAction: (userId: string) => Promise<void>;
};

export type Credentials = {
  username: string,
  password: string
}

export type UserData = {
  username: string,
  name: string,
  surname: string
  email: string
};

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

    } catch (error) {
      if (error instanceof AxiosError) {
        navigate("/login", { replace: true, state: error.response?.data.message });
      }
      /** @todo Notify for failed login */
    } finally {
      setLoading(false);
    }
  };
  
  async function logoutAction(userId: string): Promise<void> {
    try {
      // inform server about logout - perhaps redundant
      await client.post("/auth/logout", userId);

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

  return <AuthContext.Provider value={{user, token, loading, loginAction, logoutAction}}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};