import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ActorDetails from "./pages/ActorDetails";
import Favorites from "./pages/Favorites";
import ErrorPage from "./pages/ErrorPage";
import { logoutAction, requireAuthLoader } from "./utils/auth";
import LoginForm, { loginAction } from "./pages/LoginForm";
import AuthLayout from "./layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "actor/:actorId",
        element: <ActorDetails />,
      },
      {
        path: "favorites",
        element: <Favorites />,
        loader: requireAuthLoader,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
        action: loginAction,
      },
    ],
  },
  {
    path: "logout",
    action: logoutAction,
  },
]);
