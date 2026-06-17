import { FriendListItem } from "./FriendListItem";

interface FriendOption {
  id: number;
  avatar: string;
  name: string;
  isOnline: boolean;
}

interface FriendListProps {
  friends: FriendOption[];
}

export function FriendList({ friends }: FriendListProps) {
  return (
    <ul className="friend-list">
      {friends.map(({ id, avatar, name, isOnline }) => (
        <FriendListItem
          key={id}
          avatar={avatar}
          name={name}
          isOnline={isOnline}
        />
      ))}
    </ul>
  );
}
