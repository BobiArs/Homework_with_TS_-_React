import ActorCard from "./ActorCard";

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
}

interface ActorListProps {
  actors: Actor[];
}

export default function ActorList({ actors }: ActorListProps) {
  if (!actors || actors.length === 0) {
    return (
      <p className="text-center text-gray-500 font-medium mt-8">
        Акторів не було знайдено 😔
      </p>
    );
  }

  return (
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
  );
}
