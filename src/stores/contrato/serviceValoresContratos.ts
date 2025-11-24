import { createApi } from "../../utils/api";

const valoresContratosApi = createApi(
  import.meta.env.VITE_API_BACKEND_CONTRATOS
);

export const ValoresContratosService = {
  create: async (data: any) => {
    const create = await valoresContratosApi.post(
      "/valores-contratos/create",
      data
    );
    return create.data;
  },

  findAtivos: async () => {
    const find = await valoresContratosApi.get("/valores-contratos/find-ativos");
    return find.data;
  },

  findAll: async () => {
    const find = await valoresContratosApi.get("/valores-contratos");
    return find.data;
  },

  findByFilter: async (data: any) => {
    const find = await valoresContratosApi.post(
      "/valores-contratos/find-by-filter",
      data
    );
    return find.data;
  },

  update: async (data: any) => {
    const upd = await valoresContratosApi.patch(
      `/valores-contratos/${data._id}`,
      data
    );
    return upd.data;
  },
};
