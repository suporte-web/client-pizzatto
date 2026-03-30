import { Api } from "../../utils/api";

export const PoliticasService = {
  create: async (data: any) => {
    const create = await Api.post(`/politicas/create`, data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/politicas/find-by-filter`, data);
    return post.data;
  },

  update: async (data: any) => {
    const patch = await Api.patch(`/politicas/update`, data);
    return patch.data;
  },

  findPoliticaLiberadaVisualizacao: async () => {
    const get = await Api.get(`/politicas/find-politica-liberada-visualizacao`);
    return get.data;
  },

  findAllAceitesByUser: async () => {
    const get = await Api.get(`/politicas/find-all-aceites-by-user`);
    return get.data;
  },
};
