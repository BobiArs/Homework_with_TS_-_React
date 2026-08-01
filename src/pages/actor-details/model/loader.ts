import { type LoaderFunctionArgs } from "react-router";

export const actorDetailsLoader = ({ params }: LoaderFunctionArgs) => {
  const actorId = Number(params.actorId);
  if (isNaN(actorId)) {
    throw new Response("Некоректний ID актора", { status: 400 });
  }
  return { actorId };
};
