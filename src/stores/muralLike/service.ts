import { createApi } from "../../utils/api";

const adLdapApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const MuralLikeService = {
  create: async (data: any) => {
    const post = await adLdapApi.post(`/mural-like/create`, data);
    return post.data;
  },

  findByMural: async (data: any) => {
    const post = await adLdapApi.post(`/mural-like/find-by-mural`, data);
    return post.data;
  },
};
