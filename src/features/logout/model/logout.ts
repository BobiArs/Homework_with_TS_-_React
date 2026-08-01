import { redirect } from "react-router";

export function clearSessionData() {
  localStorage.removeItem("tmdb_session_id");
  localStorage.removeItem("username");
}

export function logoutAction() {
  clearSessionData();
  return redirect("/login");
}
