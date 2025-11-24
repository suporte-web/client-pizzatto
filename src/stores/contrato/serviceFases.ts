import { createApi } from "../../utils/api";

const fasesApi = createApi(import.meta.env.VITE_API_BACKEND_CONTRATOS);

export const FaseService = {
  create: async (data: any) => {
    const create = await fasesApi.post("/fase/create", data);
    return create.data;
  },

  findAll: async () => {
    const find = await fasesApi.get("/fase");
    return find.data;
  },

  findByFilter: async (data: any) => {
    const find = await fasesApi.post("/fase/find-by-filter", data);
    return find.data;
  },

  update: async (data: any) => {
    const upd = await fasesApi.patch(`/fase/${data._id}`, data);
    return upd.data;
  },
};
