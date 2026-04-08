import { Api } from "../../utils/api";

export const BibliotecaMarcaService = {
  create: async (data: any) => {
    const post = await Api.post(`/biblioteca-marca/create`, data);
    return post.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/biblioteca-marca/find-by-filter`, data);
    return post.data;
  },
};
