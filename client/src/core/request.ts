import axios, { HttpStatusCode } from "axios";
import { decryptJwt } from "./auth";

const PORT = 8443;
const PROTOCOL = "https";
const HOST = location.hostname;

export const client = axios.create({
  baseURL: `${PROTOCOL}://${HOST}:${PORT}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    validateStatus: status => {
      return status < 500;
    }
  }
);

/** Remove token as soon as a 401 Unauthorized response is received from the server */
client.interceptors.response.use(value => value, error => {
  if (error.status === HttpStatusCode.Unauthorized) {
    localStorage.removeItem("token");
  }
});

// Add a request interceptor to include the token in the request headers
client.interceptors.request.use(config => {
  const tokenString = localStorage.getItem("token") || "";

  try {
    const decryptedToken = decryptJwt(tokenString);
    if (decryptedToken.exp < (Date.now() / 1000)) { // divide by 1000 for ms to s
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  } catch {
    // do nothing
  }

  try {
    if (tokenString) {
      const token = JSON.parse(tokenString);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    localStorage.removeItem("token");
    console.error(error);
  }

  return config;
});
