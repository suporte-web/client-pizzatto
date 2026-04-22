import { createApi } from "../../utils/api";

const chatApi = createApi(import.meta.env.VITE_API_BACKEND_CHAT_INTERNO);

export const MensagemService = {
  listarMensagens: async (conversaId: string) => {
    const get = await chatApi.get(`/mensagens/${conversaId}`);
    return get.data;
  },

  enviarMensagem: async (data: { conversaId: string; conteudo: string }) => {
    const post = await chatApi.post(`/mensagens`, data);
    return post.data;
  },

  excluirMensagem: async (mensagemId: string) => {
    const patch = await chatApi.patch(`/mensagens/${mensagemId}/excluir`);
    return patch.data;
  },

  uploadArquivo: async (formData: FormData) => {
    const { data } = await chatApi.post("/mensagens/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
