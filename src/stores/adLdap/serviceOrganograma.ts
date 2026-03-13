import { createApi } from "../../utils/api";

const adLdapApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const OrganogramaService = {
  findOrganograma: async () => {
    const response = await adLdapApi.get("/organograma/get-organograma-completo");
    return response.data;
  },

  findDepartamento: async (departamento: string) => {
    const response = await adLdapApi.get("/organograma/departamento", {
      params: { nome: departamento },
    });
    return response.data;
  },

  findColaborador: async (colaborador: string) => {
    const response = await adLdapApi.get("/organograma/colaborador", {
      params: { termo: colaborador },
    });
    return response.data;
  },

  gerarPdf: async (tipo?: string, valor?: string) => {
    const response = await adLdapApi.get("/organograma/pdf", {
      params: {
        ...(tipo ? { tipo } : {}),
        ...(valor ? { valor } : {}),
      },
      responseType: "blob",
    });

    return {
      blob: response.data,
      contentDisposition: response.headers["content-disposition"],
    };
  },
};