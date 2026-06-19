import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";

const columns = ["todo", "doing", "review", "done"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  async function load() {
    const { data } = await api.get("/tasks");
    setTasks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function move(task, status) {
    await api.patch(`/tasks/${task._id}`, { status });
    load();
  }

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <p>Kanban action tracking</p>
          <h2>Meeting tasks</h2>
        </div>
        <CheckCircle2 size={22} />
      </div>
      <div className="kanban">
        {columns.map((column) => (
          <div className="kanban-column" key={column}>
            <h3>{column}</h3>
            {tasks
              .filter((task) => task.status === column)
              .map((task) => (
                <article className="task-card" key={task._id}>
                  <strong>{task.title}</strong>
                  <span>{task.meeting?.title || "Standalone task"}</span>
                  <select value={task.status} onChange={(e) => move(task, e.target.value)}>
                    {columns.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </article>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
