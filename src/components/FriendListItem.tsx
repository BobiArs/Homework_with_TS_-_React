interface FriendListItemProps {
  avatar: string;
  name: string;
  isOnline: boolean;
}

export function FriendListItem({
  avatar,
  name,
  isOnline,
}: FriendListItemProps) {
  return (
    <li className="friend-item">
      <span className={`status ${isOnline ? "online" : "offline"}`}></span>
      <img src={avatar} alt={name} width={48} className="avatar" />
      <p className="name">{name}</p>
    </li>
  );
}
