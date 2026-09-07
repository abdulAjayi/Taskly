import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import TaskItem from '../components/TaskItem'

export default function TasksPage() {
  const token = useAuthStore((state) => state.token)
  const tasks = useTaskStore((state) => state.tasks)
  const filter = useTaskStore((state) => state.filter)
  const sortBy = useTaskStore((state) => state.sortBy)
  const page = useTaskStore((state) => state.page)
  const pageSize = useTaskStore((state) => state.pageSize)
  const loading = useTaskStore((state) => state.loading)
  const busy = useTaskStore((state) => state.busy)
  const error = useTaskStore((state) => state.error)
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  const setFilter = useTaskStore((state) => state.setFilter)
  const setSortBy = useTaskStore((state) => state.setSortBy)
  const setPage = useTaskStore((state) => state.setPage)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => { if (token) void fetchTasks(token).catch(() => {}) }, [token, filter, sortBy, page, fetchTasks])
  async function add(event) { event.preventDefault(); if (!description.trim()) return setFormError('Enter a task description.'); setFormError(''); try { await addTask(token, description.trim()); setDescription('') } catch { /* store error is displayed */ } }
  async function update(id, changes) { await updateTask(token, id, changes) }
  async function remove(id) { await deleteTask(token, id) }

  return <section className="page tasks-page"><div className="page-heading"><div><p className="kicker">WORKSPACE / 01</p><h1>Task list</h1></div><p>{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p></div><form className="add-task" onSubmit={add}><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a task" aria-label="Task description" /><button className="solid" disabled={busy}>{busy ? 'Adding…' : 'Add task'} <span>+</span></button></form><div className="controls"><label>Status<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All tasks</option><option value="false">Open</option><option value="true">Completed</option></select></label><label>Order<select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="createdAt_desc">Newest first</option><option value="createdAt_asc">Oldest first</option></select></label></div>{(formError || error) && <p className="error" role="alert">{formError || error}</p>}<section className="task-list" aria-live="polite">{loading ? <p className="empty">Loading tasks…</p> : tasks.length ? tasks.map((task) => <TaskItem key={task._id} task={task} onUpdate={update} onDelete={remove} />) : <p className="empty">No tasks in this view.</p>}</section><div className="pagination"><button onClick={() => setPage(Math.max(0, page - 1))} disabled={!page || loading}>← Previous</button><span>Page {page + 1}</span><button onClick={() => setPage(page + 1)} disabled={tasks.length < pageSize || loading}>Next →</button></div></section>
}
