import { createApi } from "../../utils/api";
const contratosApi = createApi(import.meta.env.VITE_API_BACKEND_CONTRATOS);

export const ContratosService = {
  create: async (data: any) => {
    const create = await contratosApi.post("/contrato/create", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const find = await contratosApi.post("/contrato/find-by-filter", data);
    return find.data;
  },

  findById: async (id: any) => {
    const find = await contratosApi.get(`/contrato/${id}`);
    return find.data;
  },

  update: async (data: any) => {
    const find = await contratosApi.patch(`/contrato/update/${data._id}`, data);
    return find.data;
  },

  createPdfContrato: async (data: any) => {
    const create = await contratosApi.post(`/contrato/pdf-contrato`, data, {
      responseType: "blob", // ISSO É ESSENCIAL
      headers: {
        "Content-Type": "application/json",
        // A autorização já deve estar configurada globalmente no api.js
      },
    });
    return create.data;
  },
};
