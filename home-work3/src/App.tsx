import { Counter } from "./components/Counter";
import "./App.css";
import { ColorCounter } from "./components/ColorCounter";

function App() {
  return (
    <div className="app-container">
      <div className="counters-row">
        <Counter />
        <ColorCounter />
      </div>
    </div>
  );
}

export default App;
