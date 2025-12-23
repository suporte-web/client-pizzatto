import { Api } from "../../utils/api";

export const GlpiService = {
  getComputadores: async (data: any) => {
    const get = await Api.get(
      `/glpi/computers?filter=${data.filter}&page=${data.page}&limit=${data.limit}`
    );
    return get.data;
  },

  createTermoCompromisso: async (data: any) => {
    const post = await Api.post(`/glpi/create-termo-compromisso`, data);
    return post.data;
  },
};
