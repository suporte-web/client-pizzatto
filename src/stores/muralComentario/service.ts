import { createApi } from "../../utils/api";

const adLdapApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const MuralComentarioService = {
  create: async (data: any) => {
    const post = await adLdapApi.post(`/mural-comentario/create`, data);
    return post.data;
  },
  
  findByMural: async (data: any) => {
    const post = await adLdapApi.post(`/mural-comentario/find-by-mural`, data);
    return post.data;
  },

};
