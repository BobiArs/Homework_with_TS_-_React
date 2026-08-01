import { Form } from "react-router";

export default function LogoutButton() {
  return (
    <Form action="/logout" method="post" className="inline-block">
      <button
        type="submit"
        className="px-3.5 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition shadow-sm hover:shadow cursor-pointer"
      >
        Вийти
      </button>
    </Form>
  );
}
