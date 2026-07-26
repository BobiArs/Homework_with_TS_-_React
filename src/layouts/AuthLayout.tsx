import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header з логотипом */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="container mx-auto flex justify-center">
          <Link
            to="/"
            className="text-2xl font-black text-purple-600 hover:text-purple-700 transition"
          >
            🎬 Actor Explorer
          </Link>
        </div>
      </header>

      {/* Основний контент (центрований) */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Actor Explorer. Всі права захищено.
        </p>
      </footer>
    </div>
  );
}
