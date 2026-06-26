import { TodoItem } from "./TodoItem";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "normal" | "high";
  date: string;
}

interface TodoListProp {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProp) {
  return (
    <div className="mt-6 space-y-3">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          title={t.title}
          completed={t.completed}
          priority={t.priority as "low" | "normal" | "high"}
          date={t.date}
        ></TodoItem>
      ))}
    </div>
  );
}
