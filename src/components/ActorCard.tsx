import { Link } from "react-router";

interface ActorCardProps {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
}

export default function ActorCard({
  id,
  name,
  profile_path,
  popularity,
}: ActorCardProps) {
  const imageUrl = profile_path
    ? `https://image.tmdb.org/t/p/w200${profile_path}`
    : "https://placehold.co/200x300/E9D5FF/7C3AED?text=No+Image";

  return (
    <Link
      to={`/actor/${id}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-auto object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-md font-semibold truncate group-hover:text-purple-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500">
          Популярність: {popularity.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
