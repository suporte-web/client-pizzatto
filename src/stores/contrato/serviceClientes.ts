import { createApi } from "../../utils/api";
const clientesApi = createApi(import.meta.env.VITE_API_BACKEND_CONTRATOS);

export const ClienteService = {
  create: async (data: any) => {
    const create = await clientesApi.post("/cliente/create", data);
    return create.data;
  },

  findAtivos: async () => {
    const find = await clientesApi.get("/cliente/find-ativos");
    return find.data;
  },

  findAll: async () => {
    const find = await clientesApi.get("/cliente");
    return find.data;
  },

  findByFilter: async (data: any) => {
    const find = await clientesApi.post("/cliente/find-by-filter", data);
    return find.data;
  },

  update: async (data: any) => {
    const upd = await clientesApi.patch(`/cliente/${data._id}`, data);
    return upd.data;
  },
};
