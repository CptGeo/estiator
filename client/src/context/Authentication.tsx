import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { client } from "../core/request";
import { useNavigate } from "react-router-dom";

export type AuthValue = {
  token?: string | null,
  user?: UserData | null,
  loginAction: (credentials: Credentials) => Promise<void>,
  logoutAction: (user: string) => Promise<void>
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
      // perform request
      const response = await client.post("/auth/login", credentials);

      // set user and token state
      setUser(response.data.data.user);
      setToken(response.data.data.token);

      // save user and token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);

    } catch (error) {
      navigate("/login", { replace: true });
      /** @todo Notify for failed login */
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
      /** @todo Notify for failed logout */
    }
  }

  return <AuthContext.Provider value={{user, token, loginAction, logoutAction}}>{props.children}</AuthContext.Provider>
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};