import { TasksOverview } from "./tasks-overview";

export default async function Tasks() {
  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Task Planner</h1>
      <TasksOverview />
    </div>
  )
}