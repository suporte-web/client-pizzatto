import { createApi } from "../../utils/api";

const adLdapApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const MuralService = {
  create: async (data: any) => {
    const post = await adLdapApi.post(`/mural/create`, data);
    return post.data;
  },

  getAllByFilial: async () => {
    const get = await adLdapApi.get(`/mural/get-all-by-filial`);
    return get.data;
  },

  delete: async (muralId: string) => {
    const del = await adLdapApi.delete(`/mural/delete/${muralId}`);
    return del.data;
  },
};
