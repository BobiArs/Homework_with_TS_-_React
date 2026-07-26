import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { loginUser } from "../api/tmdbApi";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Всі поля обов'язкові для заповнення" };
  }

  try {
    const sessionId = await loginUser(username, password);
    localStorage.setItem("tmdb_session_id", sessionId);
    localStorage.setItem("username", username);
    return redirect("/");
  } catch (error: any) {
    const apiError =
      error?.response?.data?.status_message || "Помилка автентифікації.";
    return { error: apiError };
  }
}

export default function LoginForm() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Вхід до TMDB
      </h2>
      {actionData?.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 border border-red-200 text-center">
          {actionData.error}
        </div>
      )}
      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Ім'я користувача
          </label>
          <input
            name="username"
            type="text"
            required
            disabled={isSubmitting}
            className="w-full border p-2.5 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Пароль
          </label>
          <input
            name="password"
            type="password"
            required
            disabled={isSubmitting}
            className="w-full border p-2.5 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Вхід..." : "Увійти"}
        </button>
      </Form>
    </div>
  );
}
