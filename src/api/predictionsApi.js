import api from "./axios";

export const predictionsApi = {
  getAll: async () => {
    const { data } = await api.get("/predictions");
    return data.data;
  },

  getByUser: async (email) => {
    const { data } = await api.get(
      `/predictions/user/${encodeURIComponent(email)}`
    );
    return data.data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/predictions/${id}`);
    return data.data;
  },

  create: async (payload) => {
    const { data } = await api.post("/predictions", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/predictions/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/predictions/${id}`);
    return data;
  },
};
