import { redirect } from "react-router";

export const isAuthenticated = () => {
  return !!localStorage.getItem("tmdb_session_id");
};

export const requireAuthLoader = () => {
  const token = localStorage.getItem("tmdb_session_id");
  if (!token) {
    return redirect("/login");
  }

  return null;
};

export function logoutAction() {
  localStorage.removeItem("tmdb_session_id");
  localStorage.removeItem("username");

  return redirect("/login");
}
