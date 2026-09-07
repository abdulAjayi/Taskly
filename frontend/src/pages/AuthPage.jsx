import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore'

export default function AuthPage({ signup = false }) {
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const busy = useAuthStore((state) => state.busy);
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();
  const location = useLocation();
  const [validationError, setValidationError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 6)
      return setValidationError("Password must be at least 6 characters.");
    clearError(); setValidationError("");
    try {
      const data = { email: String(form.get("email")).trim(), password };
      if (signup) {
        data.name = String(form.get("name")).trim();
        data.age = Number(form.get("age") || 0);
        if (!data.name) throw new Error("Name is required.");
      }
      await (signup ? signUp(data) : signIn(data));
      navigate(location.state?.from?.pathname || "/tasks", { replace: true });
    } catch (err) {
      setValidationError(err.message || "Unable to continue.");
    }
  }
  return (
    <main className="auth">
      <section className="auth-intro">
        <p>Task management</p>
        <h1>
          Clear work.
          <br />
          Clear mind.
        </h1>
        <span>01 — 01</span>
      </section>
      <section className="auth-form">
        <Link className="brand" to="/login">
          <b>□</b> TASKLY
        </Link>
        <div>
          <p className="kicker">{signup ? "NEW ACCOUNT" : "WELCOME BACK"}</p>
          <h2>{signup ? "Join the list." : "Sign in."}</h2>
          <p className="lede">
            {signup
              ? "A simple system for the work in front of you."
              : "Your tasks are ready when you are."}
          </p>
          {(validationError || storeError) && (
            <p className="error" role="alert">
              {validationError || storeError}
            </p>
          )}
          <form onSubmit={submit} noValidate>
            {signup && (
              <>
                <label>
                  Name
                  <input name="name" autoComplete="name" required />
                </label>
                <label>
                  Age <em>optional</em>
                  <input name="age" type="number" min="0" />
                </label>
              </>
            )}
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                minLength="6"
                autoComplete={signup ? "new-password" : "current-password"}
                required
              />
            </label>
            <button className="solid" disabled={busy}>
              {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}{" "}
              <span>→</span>
            </button>
          </form>
          <p className="switch">
            {signup ? "Already registered?" : "New to Taskly?"}{" "}
            <Link to={signup ? "/login" : "/signup"}>
              {signup ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
