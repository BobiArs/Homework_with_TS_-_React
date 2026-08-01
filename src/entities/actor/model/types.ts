export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  character?: string;
}

export interface MovieCredits {
  cast: Movie[];
}

export interface ActorDetails extends Actor {
  birthday: string | null;
  place_of_birth: string | null;
  biography: string | null;
  movie_credits: MovieCredits;
}

export interface FavoriteActor {
  id: number;
  name: string;
  profile_path?: string | null;
}
