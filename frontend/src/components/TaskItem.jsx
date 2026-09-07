import { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault();
    if (!description.trim()) return setError("A task needs a description.");
    setBusy(true);
    setError("");
    try {
      await onUpdate(task._id, { description: description.trim() });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function toggle() {
    setBusy(true);
    setError("");
    try {
      await onUpdate(task._id, { completed: !task.completed });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!window.confirm("Delete this task?")) return;
    setBusy(true);
    try {
      await onDelete(task._id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  return (
    <article className={`task-item ${task.completed ? "is-complete" : ""}`}>
      <button
        className="check"
        onClick={toggle}
        disabled={busy}
        aria-label="Toggle task completion"
      >
        {task.completed ? "✓" : ""}
      </button>
      <div className="task-content">
        {editing ? (
          <form onSubmit={save} className="edit-form">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
            <button disabled={busy}>Save</button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setDescription(task.description);
                setError("");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button className="task-title" onClick={() => setEditing(true)}>
            {task.description}
          </button>
        )}
        {error && <p className="item-error">{error}</p>}
      </div>
      {!editing && (
        <button className="delete" onClick={remove} disabled={busy}>
          Delete
        </button>
      )}
    </article>
  );
}
