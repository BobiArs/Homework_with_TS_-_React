import { Link, NavLink, Outlet } from "react-router";
import { LogoutButton } from "@/features/logout";
import { isSessionActive } from "@/entities/session";

export default function MainLayout() {
  const username = localStorage.getItem("username");
  const authenticated = isSessionActive();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black text-purple-600 hover:text-purple-700 transition"
          >
            🎬 Actor Explorer
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <nav className="flex gap-6 font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition duration-200 hover:text-purple-600 ${
                    isActive
                      ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                      : "text-gray-600"
                  }`
                }
              >
                Головна
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `transition duration-200 hover:text-purple-600 ${
                    isActive
                      ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                      : "text-gray-600"
                  }`
                }
              >
                Обране
              </NavLink>
            </nav>

            {authenticated ? (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <span className="text-sm text-gray-650">
                  Привіт, <span className="font-bold text-gray-800">{username}</span>
                </span>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
                >
                  Увійти
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-6">
        <Outlet />
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
