import "./App.css";
import { Profile } from "./components/Profile";
import { Statistica } from "./components/Statistics";
import { FriendList } from "./components/FriendList";
import userBD from "./data/user.json";
import statsData from "./data/data.json";
import friendBD from "./data/friends.json";

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <Profile
          username={userBD.username}
          tag={userBD.tag}
          location={userBD.location}
          avatar={userBD.avatar}
          stats={userBD.stats}
        />

        <div className="card">
          <Statistica title="Статистика завантажень" stats={statsData} />

          {/* У випадку якщо title не передається, то ↓ */}

          <Statistica stats={statsData} />
        </div>

        <div className="card">
          <FriendList friends={friendBD} />
        </div>
      </div>
    </div>
  );
}

export default App;
