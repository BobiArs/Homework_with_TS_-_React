export const isSessionActive = (): boolean => {
  return !!localStorage.getItem("tmdb_session_id");
};
