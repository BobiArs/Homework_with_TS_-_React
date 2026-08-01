import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { actorQueries, ActorCard } from "@/entities/actor";
import { SearchForm } from "@/features/search-actors";
import { Pagination } from "@/shared/ui";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  // Використовуємо налаштовані запити з entities/actor
  const { data, isLoading, isError } = useQuery(
    query ? actorQueries.search(query, page) : actorQueries.popular(page)
  );

  const handleSearch = (newQuery: string) => {
    setSearchParams({
      query: newQuery,
      page: "1",
    });
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

  if (isLoading) return <p className="text-center font-medium mt-8 text-gray-500">Завантаження...</p>;
  if (isError)
    return <p className="text-center font-medium mt-8 text-red-500">Помилка завантаження 😔</p>;

  const actors = data?.results || [];

  return (
    <div className="space-y-6">
      <SearchForm initialQuery={query} onSearch={handleSearch} />

      {actors.length === 0 ? (
        <p className="text-center text-gray-505 font-semibold mt-8">
          Акторів не було знайдено 😔
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {actors.map((actor) => (
            <ActorCard
              key={actor.id}
              id={actor.id}
              name={actor.name}
              profile_path={actor.profile_path}
              popularity={actor.popularity}
            />
          ))}
        </div>
      )}

      {actors.length > 0 && (
        <Pagination
          page={page}
          totalPages={data?.total_pages || 1}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
