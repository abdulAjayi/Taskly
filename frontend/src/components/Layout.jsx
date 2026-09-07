import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore'

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  async function logout() {
    try { await logoutAction(); } finally { navigate("/login"); }
  }
  return (
    <main className="app">
      <header>
        <NavLink to="/tasks" className="brand">
          <b>□</b> TASKS
        </NavLink>
        <nav>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <button onClick={logout}>Log out</button>
        </nav>
      </header>
      <Outlet context={{ user }} />
    </main>
  );
}
