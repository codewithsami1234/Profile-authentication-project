import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import axios from "axios";

/* 🧠 Configure Axios globally to always send token */
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:8080"; // use env if available

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attach token in the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* 🔐 Protect routes that require authentication */
export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem("token");

  // ✅ Handle expired/invalid tokens
  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("token");
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

/* 🧩 Protect routes that require username in store */
export const ProtectRoute = ({ children }) => {
  const username = useAuthStore.getState().auth.username;

  // ✅ Handle empty username or state reset
  if (!username || username.trim() === "") {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};
