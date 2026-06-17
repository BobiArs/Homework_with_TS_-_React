interface ProfileProps {
  username: string;
  tag: string;
  location: string;
  avatar: string;
  stats: {
    followers: number;
    views: number;
    likes: number;
  };
}

export function Profile({
  username,
  tag,
  location,
  avatar,
  stats,
}: ProfileProps) {
  return (
    <div className="profile">
      <div className="description">
        <img src={avatar} alt="" className="avatar" />
        <p className="name">{username}</p>
        <p className="tag">@{tag}</p>
        <p className="location">{location}</p>
      </div>

      <ul className="stats">
        {Object.entries(stats).map(([key, value]) => (
          <li key={key}>
            <span className="label">{key}</span>
            <span className="quantity">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
