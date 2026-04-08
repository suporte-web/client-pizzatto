import { Api } from "../../utils/api";

export const PaginaInstitucionalService = {
  create: async (data: any) => {
    const post = await Api.post(`/pagina-institucional/create`, data);
    return post.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/pagina-institucional/find-by-filter`, data);
    return post.data;
  },

  update: async (data: any) => {
    const patch = await Api.patch(`/pagina-institucional/update`, data);
    return patch.data;
  },
};
