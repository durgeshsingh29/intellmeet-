import { CalendarPlus, Radio, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: "", agenda: "" });

  async function load() {
    const { data } = await api.get("/meetings");
    setMeetings(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createMeeting(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    await api.post("/meetings", form);
    setForm({ title: "", agenda: "" });
    load();
  }

  return (
    <section className="grid two">
      <div className="panel">
        <div className="section-title">
          <div>
            <p>Meeting command center</p>
            <h2>Schedule and join rooms</h2>
          </div>
          <Search size={20} />
        </div>
        <div className="meeting-list">
          {meetings.map((meeting) => (
            <Link className="meeting-row" key={meeting._id} to={`/meetings/${meeting._id}`}>
              <div>
                <strong>{meeting.title}</strong>
                <span>{meeting.agenda || "No agenda added"}</span>
              </div>
              <em className={meeting.status}>{meeting.status}</em>
            </Link>
          ))}
        </div>
      </div>
      <form className="panel form-panel" onSubmit={createMeeting}>
        <CalendarPlus size={28} />
        <h2>Create meeting</h2>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Quarterly product review" />
        </label>
        <label>
          Agenda
          <textarea value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} placeholder="Goals, blockers, decisions" />
        </label>
        <button className="primary-button">
          <Radio size={18} />
          Create room
        </button>
      </form>
    </section>
  );
}
