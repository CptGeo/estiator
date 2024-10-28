import axios from "axios";

export const client = axios.create({
  baseURL: "http://192.168.0.28:7777",
  headers: {
    'Accept': 'application/json'
  }
});