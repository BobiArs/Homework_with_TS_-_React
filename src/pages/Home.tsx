import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getPopularActors, searchActors } from "../api/tmdbApi";
import SearchForm from "../components/SearchForm";
import ActorList from "../components/ActorList";
import Pagination from "../components/Pagination";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["actors", query, page],
    queryFn: () => (query ? searchActors(query, page) : getPopularActors(page)),
  });

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

  if (isLoading) return <p className="text-center">Завантаження...</p>;
  if (isError)
    return <p className="text-center text-red-500">Помилка завантаження</p>;

  return (
    <div className="space-y-6">
      <SearchForm initialQuery={query} onSearch={handleSearch} />

      {data?.results && <ActorList actors={data.results} />}

      <Pagination
        page={page}
        totalPages={data?.total_pages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
