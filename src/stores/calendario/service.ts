import { Api } from "../../utils/api";

export const CalendarioService = {
  create: async (data: any) => {
    const post = await Api.post(`/calendario/create`, data);
    return post.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/calendario/find-by-filter`, data);
    return post.data;
  },


};
