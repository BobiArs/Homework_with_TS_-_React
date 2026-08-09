import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewsListPage } from "./pages/NewsListPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { Header } from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<NewsListPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
          </Routes>
        </main>
        <footer className="py-6 border-t border-zinc-200/50 dark:border-zinc-800/30 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} VortexNews. Всі права захищені.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
