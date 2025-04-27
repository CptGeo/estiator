import axios, { HttpStatusCode } from "axios";

export const client = axios.create({
  baseURL: "https://192.168.1.194:8443",
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
