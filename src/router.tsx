import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ActorDetails from "./pages/ActorDetails";
import Favorites from "./pages/Favorites";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
      },
    ],
  },
]);
