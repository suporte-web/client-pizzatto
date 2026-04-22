import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

type TipoMensagem = "TEXTO" | "IMAGEM" | "ARQUIVO";

type EnviarMensagemPayload = {
  conversaId: string;
  conteudo?: string;
  tipo?: TipoMensagem;
  arquivoUrl?: string;
  nomeArquivo?: string;
  nomeSalvo?: string;
  mimeType?: string;
  tamanhoBytes?: number;
};

export const SocketChatService = {
  connect: (token: string) => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_BACKEND_CHAT_INTERNO, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });
    } else {
      socket.auth = { token };

      if (!socket.connected) {
        socket.connect();
      }
    }

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  entrarNaConversa: (
    conversaId: string,
    callback?: (response: any) => void,
  ) => {
    if (!socket?.connected) {
      console.error("Socket desconectado ao entrar na conversa");
      return;
    }

    socket.emit("conversa:entrar", { conversaId }, callback);
  },

  sairDaConversa: (conversaId: string) => {
    if (!socket?.connected) return;
    socket.emit("conversa:sair", { conversaId });
  },

  enviarMensagem: (
    data: EnviarMensagemPayload,
    callback?: (response: any) => void,
  ) => {
    if (!socket) {
      console.error("Socket não inicializado");
      return;
    }

    if (!socket.connected) {
      console.error("Socket desconectado");
      socket.connect();
      return;
    }

    socket.emit("mensagem:enviar", data, callback);
  },

  marcarComoLida: (conversaId: string) => {
    if (!socket?.connected) return;
    socket.emit("conversa:lida", { conversaId });
  },

  onNovaMensagem: (callback: (mensagem: any) => void) => {
    socket?.on("mensagem:nova", callback);
  },

  offNovaMensagem: (callback: (mensagem: any) => void) => {
    socket?.off("mensagem:nova", callback);
  },

  onConversaAtualizada: (callback: (payload: any) => void) => {
    socket?.on("conversa:atualizada", callback);
  },

  offConversaAtualizada: (callback: (payload: any) => void) => {
    socket?.off("conversa:atualizada", callback);
  },
};
