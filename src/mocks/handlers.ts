import { delay, HttpResponse, http } from "msw";
import { news } from "./db";

export const handlers = [
  http.get("/api/news", async () => {
    await delay(600);
    const list = news.map((item) => {
      const rest = { ...item };
      delete (rest as Partial<typeof item>).content;
      return rest;
    });

    return HttpResponse.json(list, { status: 200 });
  }),

  http.get("/api/news/:id", async ({ params }) => {
    await delay(600);
    const { id } = params;
    const item = news.find((n) => n.id === Number(id));

    if (!item) {
      return HttpResponse.json(
        { message: "Цю новину не було знайдено!" },
        { status: 404 }
      );
    }

    return HttpResponse.json(item, { status: 200 });
  }),
];
