import api from "./axios";

export const usersApi = {
  getAll: async () => {
    const { data } = await api.get("/users");
    return data.data;
  },

  getByEmail: async (email) => {
    const { data } = await api.get(`/users/${encodeURIComponent(email)}`);
    return data.data;
  },

  register: async (payload) => {
    const { data } = await api.post("/users/register", payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await api.post("/users/login", payload);
    return data;
  },

  updateRole: async (email, role) => {
    const { data } = await api.patch(`/users/${encodeURIComponent(email)}/role`, {
      role,
    });
    return data;
  },

  delete: async (email) => {
    const { data } = await api.delete(`/users/${encodeURIComponent(email)}`);
    return data;
  },
};
