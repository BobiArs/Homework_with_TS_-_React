import { Link, NavLink, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function MainLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto py-8 px-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Actor Explorer. Всі права
            захищено.
          </p>
        </footer>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
