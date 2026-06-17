import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Main } from "./components/Main";
import "./index.css";
import { Footer } from "./components/Footer";

function App() {
  const menuItms = ["Home", "About", "Contact", "..."];

  return (
    <div className="app">
      <Header items={menuItms} />
      <div className="content">
        <Sidebar />
        <Main title="Вітаю тебе на моєму сайті!" />
      </div>
      <Footer />
    </div>
  );
}

export default App;
