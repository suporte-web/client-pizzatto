import { createApi } from "../../utils/api";

const chatApi = createApi(import.meta.env.VITE_API_BACKEND_CHAT_INTERNO);

export const ConversaService = {
  criarDireta: async (data: { adObjectGuidDestino: string }) => {
    const post = await chatApi.post(`/conversas/direta`, data);
    return post.data;
  },

  criarGrupo: async (data: {
    nome: string;
    adObjectGuidsParticipantes: string[];
  }) => {
    const post = await chatApi.post(`/conversas/grupo`, data);
    return post.data;
  },

  listarMinhasConversas: async () => {
    const get = await chatApi.get(`/conversas`);
    return get.data;
  },

  buscarPorId: async (conversaId: string) => {
    const get = await chatApi.get(`/conversas/${conversaId}`);
    return get.data;
  },

  marcarComoLida: async (conversaId: string) => {
    const patch = await chatApi.patch(`/conversas/${conversaId}/ler`);
    return patch.data;
  },

  adicionarParticipante: async (data: any) => {
    const post = await chatApi.post(`/conversas/adicionar-participante`, data);
    return post.data;
  },

  alterarAdminParticipantes: async (data: any) => {
    const post = await chatApi.patch(
      `/conversas/alterar-admin-participante`,
      data,
    );
    return post.data;
  },

  removerParticipantes: async (id: string) => {
    const del = await chatApi.delete(`/conversas/remover-participante/${id}`);
    return del.data;
  },

  changeNomeGrupo: async (data: any) => {
    const patch = await chatApi.patch(`/conversas/change-nome-grupo`, data);
    return patch.data;
  },
};
