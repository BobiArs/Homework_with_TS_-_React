export function TaskForm() {
  return (
    <form className="bg-white p-4 rounded-lg shadow space-y-3">
      <input
        type="text"
        placeholder="Назва задачі"
        className="w-full border rounded px-3 py-2"
      />
      <div className="grid grid-cols-2 gap-3">
        <input type="date" className="w-full border rounded px-3 py-2" />
        <select className="w-full border rounded px-3 py-2">
          <option>Низький пріоритет</option>
          <option>Середній пріоритет</option>
          <option>Високий пріоритет</option>
        </select>
        <div className="flex gap-2">
          <button
            type="button"
            className=" flex-1 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Додати
          </button>
          <button type="reset" className="flex-1 bg-gray-300 px-4 py-2 rounded">
            Очистити
          </button>
        </div>
      </div>
    </form>
  );
}
