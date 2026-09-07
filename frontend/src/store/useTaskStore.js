import { create } from 'zustand'
import { taskApi } from '../services/api'

const PAGE_SIZE = 10

export const useTaskStore = create((set, get) => ({
  tasks: [],
  filter: '',
  sortBy: 'createdAt_desc',
  page: 0,
  loading: false,
  busy: false,
  error: '',
  pageSize: PAGE_SIZE,

  setFilter: (filter) => set({ filter, page: 0 }),
  setSortBy: (sortBy) => set({ sortBy, page: 0 }),
  setPage: (page) => set({ page }),
  clearError: () => set({ error: '' }),
  fetchTasks: async (token) => {
    const { filter, sortBy, page, pageSize } = get()
    set({ loading: true, error: '' })
    try {
      const tasks = await taskApi.list(token, {
        ...(filter ? { completed: filter } : {}),
        sortBy,
        limit: pageSize,
        skip: page * pageSize,
      })
      set({ tasks })
      return tasks
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ loading: false }) }
  },
  addTask: async (token, description) => {
    set({ busy: true, error: '' })
    try {
      const task = await taskApi.create(token, { description, completed: false })
      const { page, filter, tasks } = get()
      if (page === 0 && (!filter || filter === 'false')) set({ tasks: [task, ...tasks] })
      return task
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ busy: false }) }
  },
  updateTask: async (token, id, changes) => {
    set({ busy: true, error: '' })
    try {
      const updated = await taskApi.update(token, id, changes)
      set((state) => {
        const matchesFilter = !state.filter || String(updated.completed) === state.filter
        return { tasks: matchesFilter ? state.tasks.map((task) => task._id === id ? updated : task) : state.tasks.filter((task) => task._id !== id) }
      })
      return updated
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ busy: false }) }
  },
  deleteTask: async (token, id) => {
    set({ busy: true, error: '' })
    try {
      await taskApi.remove(token, id)
      set((state) => ({ tasks: state.tasks.filter((task) => task._id !== id) }))
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally { set({ busy: false }) }
  },
}))
