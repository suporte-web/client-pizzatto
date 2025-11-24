import { createApi } from "../../utils/api";

const fornecedoresApi = createApi(import.meta.env.VITE_API_BACKEND_CONTRATOS);

export const FornecedorService = {
  create: async (data: any) => {
    const create = await fornecedoresApi.post("/fornecedor/create", data);
    return create.data;
  },

  findAtivos: async () => {
    const find = await fornecedoresApi.get("/fornecedor/find-ativos");
    return find.data;
  },

  findAll: async () => {
    const find = await fornecedoresApi.get("/fornecedor");
    return find.data;
  },

  findByFilter: async (data: any) => {
    const find = await fornecedoresApi.post("/fornecedor/find-by-filter", data);
    return find.data;
  },

  update: async (data: any) => {
    const upd = await fornecedoresApi.patch(
      `/fornecedor/${data._id}`,
      data
    );
    return upd.data;
  },
};
