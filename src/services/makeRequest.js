import axios from "axios";

export function makeRequest(url, options) {
  const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
  });

  return api(url, options)
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? "Error")
    );
}
