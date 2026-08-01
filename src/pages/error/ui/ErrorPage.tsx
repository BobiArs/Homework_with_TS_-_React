import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "Щось пішло не так. Спробуйте пізніше.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    if (error.status === 404) {
      errorMessage = "Ой! Такої сторінки не існує (404).";
    } else if (error.status === 401) {
      errorMessage = "У вас немає доступу до цієї сторінки.";
    } else {
      errorMessage = error.data?.message || error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-red-105">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-black mb-6 mx-auto">
          {errorStatus}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Сталася помилка
        </h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition cursor-pointer"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
