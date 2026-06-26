interface TodoItemProp {
  title: string;
  completed: boolean;
  priority: "low" | "normal" | "high";
  date: string;
}

export function TodoItem({ title, completed, priority, date }: TodoItemProp) {
  const now = new Date();
  const taskDate = new Date(date);
  const isOver = !completed && taskDate < now;
  const priorityClass = {
    low: "border-l-4 border-green-500",
    normal: "",
    high: "border-l-4 border-red-500",
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow flex justify-between items-center ${priorityClass[priority]} ${completed ? "opacity-60" : ""} ${isOver ? "border-red-600 shadow-md" : ""}`}
    >
      <span className={`${completed ? "line-through text-gray-500" : ""}`}>
        {title}
      </span>
      <span className="text-sm text-gray-400">
        {new Date(date).toLocaleString()}
      </span>
    </div>
  );
}
