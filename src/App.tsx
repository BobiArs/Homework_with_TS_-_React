import { TaskFilters } from './components/TaskFilters'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStats } from './components/TaskStats'

function App() {
  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">
          📋 Панель керування завданнями
        </h1>
        <TaskForm />
        <TaskFilters />
        <TaskStats />
        <TaskList />
      </div>
    </div>
  )
}

export default App
