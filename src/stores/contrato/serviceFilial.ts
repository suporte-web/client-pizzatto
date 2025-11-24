import { createApi } from "../../utils/api";

const filiaisApi = createApi(import.meta.env.VITE_API_BACKEND_CONTRATOS);

export const FilialService = {
  create: async (data: any) => {
    const create = await filiaisApi.post("/filial/create", data);
    return create.data;
  },

  findAll: async () => {
    const find = await filiaisApi.get("/filial/find-all");
    return find.data;
  },

  findAtivos: async () => {
    const find = await filiaisApi.get("/filial/find-ativos");
    return find.data;
  },

  findByFilter: async (data: any) => {
    const find = await filiaisApi.post("/filial/find-by-filter", data);
    return find.data;
  },

  findById: async (id: any) => {
    const find = await filiaisApi.get(`/filial/${id}`);
    return find.data;
  },

  update: async (data: any) => {
    const upd = await filiaisApi.patch(`/filial/${data._id}`, data);
    return upd.data;
  },
};
