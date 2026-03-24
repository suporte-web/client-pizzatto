import { Api } from "../../utils/api";

export const AssinaturaPadraoService = {
  create: async (data: any) => {
    const post = await Api.post(`/assinatura-padrao/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return post.data;
  },

  findAtual: async () => {
    const get = await Api.get(`/assinatura-padrao/find-atual`);
    return get.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post(`/assinatura-padrao/find-by-filter`, data);
    return post.data;
  },
};
