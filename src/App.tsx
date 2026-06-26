import { Counter } from "./components/Counter";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TodoList, type Todo } from "./components/TodoList";

function App() {
  const mockTodos: Todo[] = [
    {
      id: "1",
      title: "Прибрати в кімнаті",
      completed: false,
      priority: "low",
      date: "2026-06-20T12:00",
    },
    {
      id: "2",
      title: "Підготуватися до лекції з React",
      completed: false,
      priority: "high",
      date: "2026-06-16T18:00", // Прострочена задача
    },
    {
      id: "3",
      title: "Здати домашнє завдання №4",
      completed: true,
      priority: "normal",
      date: "2026-06-15T15:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <TaskForm />
          <TodoList todos={mockTodos} />
        </div>
        <Counter />
      </div>
    </div>
  );
}

export default App;
