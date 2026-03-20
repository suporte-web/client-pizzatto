import { Api } from "../../utils/api";

export const AssinaturaEmailService = {
  create: async (data: any) => {
    const post = await Api.post(`/assinaturas-email/create`, data);
    return post.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/assinaturas-email/find-by-filter`, data);
    return post.data;
  },

  updateValidacao: async (data: any) => {
    const patch = await Api.patch(
      `/assinaturas-email/update-validacao/${data.id}`,
      data,
    );
    return patch.data;
  },
};
