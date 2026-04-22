import { createApi } from "../../utils/api";

const chatApi = createApi(import.meta.env.VITE_API_BACKEND_CHAT_INTERNO);

export const ColaboradorChatService = {
  listarAtivos: async () => {
    const get = await chatApi.get(`/user-chat/listar`);
    return get.data;
  },
};