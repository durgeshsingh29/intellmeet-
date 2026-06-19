import { Activity, Clock, ListTodo, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then((res) => setData(res.data));
  }, []);

  const cards = [
    { label: "Total meetings", value: data?.totalMeetings || 0, icon: Video },
    { label: "Live meetings", value: data?.liveMeetings || 0, icon: Activity },
    { label: "Tasks completed", value: data?.completedTasks || 0, icon: ListTodo },
    { label: "Hours saved", value: data?.followUpSavedHours || 0, icon: Clock }
  ];

  return (
    <section className="analytics">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="metric-card" key={card.label}>
            <Icon size={24} />
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        );
      })}
      <div className="panel score-panel">
        <p>Productivity score</p>
        <h2>{data?.productivityScore || 0}%</h2>
        <div className="progress">
          <span style={{ width: `${data?.productivityScore || 0}%` }} />
        </div>
      </div>
    </section>
  );
}
