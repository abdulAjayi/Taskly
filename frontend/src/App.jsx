import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from 'react'
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)
  useEffect(() => { void restoreSession().catch(() => {}) }, [restoreSession])
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
