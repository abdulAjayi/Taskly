import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore'

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const loading = useAuthStore((state) => state.loading)
  if (loading)
    return <main className="loading-screen">Checking session…</main>;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
