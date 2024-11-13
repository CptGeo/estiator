import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:7777",
  headers: {
    'Accept': 'application/json'
  }
});