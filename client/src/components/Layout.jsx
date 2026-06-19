import { BarChart3, CheckSquare, LogOut, MonitorUp, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const nav = [
  { to: "/", label: "Meetings", icon: MonitorUp },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 }
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Sparkles size={26} />
          <div>
            <strong>IntellMeet</strong>
            <span>AI Collaboration</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <button className="ghost-button" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p>Enterprise meeting intelligence</p>
            <h1>Welcome, {user?.name}</h1>
          </div>
          <div className="avatar">{user?.name?.slice(0, 1)}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
