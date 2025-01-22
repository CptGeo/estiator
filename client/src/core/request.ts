import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    'Accept': 'application/json',
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
