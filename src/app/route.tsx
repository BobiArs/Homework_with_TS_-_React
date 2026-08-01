import { createBrowserRouter } from "react-router";
import { MainLayout, AuthLayout } from "@/pages/layouts";
import { HomePage } from "@/pages/home";
import { ActorDetailsPage, actorDetailsLoader } from "@/pages/actor-details";
import { FavoritesPage, favoritesLoader } from "@/pages/favorites";
import { LoginPage } from "@/pages/login";
import { ErrorPage } from "@/pages/error";
import { loginAction } from "@/features/auth-by-username";
import { logoutAction } from "@/features/logout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "actor/:actorId",
        element: <ActorDetailsPage />,
        loader: actorDetailsLoader,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
        loader: favoritesLoader,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
    ],
  },
  {
    path: "logout",
    action: logoutAction,
  },
]);
