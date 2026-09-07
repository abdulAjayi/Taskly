const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { token, headers, ...options } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    const text = await response.text();
    let data = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      /* backend can return plain text */
    }
    if (!response.ok) {
      const message =
        data?.error ||
        (typeof data === "string" && data) ||
        `Request failed (${response.status})`;
      throw new ApiError(message, response.status);
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      `Unable to reach the API at ${API_URL}. Start the backend or check VITE_API_URL, then try again.`,
    );
  }
}

const json = (method, body, token) => ({
  method,
  token,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const authApi = {
  signup: (payload) => request("/users/sign", json("POST", payload)),
  login: (payload) => request("/users/login", json("POST", payload)),
  logout: (token) => request("/users/logout", { method: "POST", token }),
  me: (token) => request("/users/me", { token }),
};

export const taskApi = {
  list: (token, params = {}) =>
    request(`/tasks/all?${new URLSearchParams(params)}`, { token }),
  create: (token, payload) => request("/tasks", json("POST", payload, token)),
  update: (token, id, payload) =>
    request(`/tasks/${id}`, json("PATCH", payload, token)),
  remove: (token, id) => request(`/tasks/${id}`, { method: "DELETE", token }),
};

export const userApi = {
  uploadAvatar: (token, file) => {
    const body = new FormData();
    body.append("upload", file);
    return request("/users/me/upload", { method: "POST", token, body });
  },
  avatarUrl: (id) => `${API_URL}/users/${id}/avatar`,
};
