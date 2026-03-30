import { Api } from "../../utils/api";

export const PoliticasAceitesService = {
  create: async (data: any) => {
    const post = await Api.post(`/politicas-aceites/create`, data);
    return post.data;
  },

  findAceitesByIdPoliticas: async (data: any) => {
    const get = await Api.get(
      `/politicas-aceites/find-aceites-by-id-politicas/${data.id}`,
    );
    return get.data;
  },
};
