import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { getPopularActors, searchActors } from "./api/tmdbApi";
import ActorDetailsModal from "./components/ActorDetailsModal";
import Pagination from "./components/Pagination";
import ActorList from "./components/ActorList";
import SearchForm from "./components/SearchForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function ActorFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: searchQuery
      ? ["searchActors", searchQuery, page]
      : ["popularActors", page],
    queryFn: () =>
      searchQuery ? searchActors(searchQuery, page) : getPopularActors(page),
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎬 Пошук акторів TMDB
      </h1>

      {/* Форма пошуку */}
      <SearchForm
        onSearch={(query) => {
          setSearchQuery(query);
          setPage(1);
        }}
      />

      {/* Стан завантаження */}
      {isPending && (
        <p className="text-center text-gray-500">Завантаження...</p>
      )}
      {isError && (
        <p className="text-center text-red-500">
          Помилка при завантаженні даних 😔
        </p>
      )}

      {/* Список акторів */}
      {data && (
        <>
          <ActorList
            actors={data.results}
            onActorClick={(id) => setSelectedActorId(id)}
          />

          {/* Пагінація */}
          <Pagination
            page={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Модальне вікно */}
      {selectedActorId && (
        <ActorDetailsModal
          personId={selectedActorId}
          onClose={() => setSelectedActorId(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ActorFinder />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
