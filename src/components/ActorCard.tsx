interface ActorCardProps {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  onClick: (id: number) => void;
}

const imgBaseUrl = "https://image.tmdb.org/t/p/w185";
const fallbackImg = "https://via.placeholder.com/185x250?text=No+Image";

export default function ActorCard({
  id,
  name,
  profile_path,
  popularity,
  onClick,
}: ActorCardProps) {
  const imageUrl = profile_path ? `${imgBaseUrl}${profile_path}` : fallbackImg;

  return (
    <div
      onClick={() => onClick(id)}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col items-center text-center"
    >
      <img
        src={imageUrl}
        alt={name}
        className="rounded-md w-full h-[250px] object-cover mb-4"
      />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        Популярність: {popularity.toFixed(1)}
      </p>
    </div>
  );
}
