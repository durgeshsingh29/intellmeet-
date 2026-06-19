import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, login, register, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "Demo Admin",
    email: "admin@intellmeet.com",
    password: "password123"
  });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form);
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot reach the backend. Start MongoDB and the server on http://localhost:5000.");
        return;
      }

      setError(err.response?.data?.message || err.message || "Login failed. Check backend terminal logs.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <BrainCircuit size={42} />
        <h1>IntellMeet</h1>
        <p>Real-time video meetings, live collaboration, AI summaries, action items, and productivity analytics for enterprise teams.</p>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
        </div>
        {mode === "register" && (
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Enter workspace" : "Create account"}
        </button>
      </form>
    </main>
  );
}
