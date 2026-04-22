import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

import SidebarNew from "../../components/Sidebar";
import { ConversaService } from "../../stores/chatInterno/conversaService";
import { MensagemService } from "../../stores/chatInterno/mensagemService";
import { SocketChatService } from "../../stores/chatInterno/socketChatService";
import ModalCreateNovaConversa from "./components/ModalCreateNovaConversa";
import { useUser } from "../../UserContext";
import { blue } from "@mui/material/colors";
import ModalGrupo from "./components/ModalGrupo";
import EmojiPicker from "./components/EmojiPicker";

type UsuarioChat = {
  id: string;
  nome: string;
  email?: string | null;
  usuario?: string;
  adObjectGuid?: string;
};

type ParticipanteConversa = {
  id: string;
  usuarioId: string;
  admin: boolean;
  ultimaLeituraEm?: string | null;
  usuario?: UsuarioChat;
  UsuarioChat?: UsuarioChat;
};

type TipoMensagem = "TEXTO" | "IMAGEM" | "ARQUIVO";

type Mensagem = {
  id: string;
  conversaId: string;
  remetenteId: string;
  conteudo?: string | null;
  tipo?: TipoMensagem;
  arquivoUrl?: string | null;
  nomeArquivo?: string | null;
  nomeSalvo?: string | null;
  mimeType?: string | null;
  tamanhoBytes?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  excluida?: boolean;
  remetente?: UsuarioChat;
  UsuarioChat?: UsuarioChat;
};

type Conversa = {
  id: string;
  tipo: "DIRETA" | "GRUPO";
  nome?: string | null;
  ultimaMensagemEm?: string | null;
  temNaoLidas?: boolean;
  quantidadeNaoLidas?: number;
  participantes?: ParticipanteConversa[];
  ParticipanteConversa?: ParticipanteConversa[];
  mensagens?: Mensagem[];
  Mensagem?: Mensagem[];
};

const styles = {
  rootPaper: {
    height: "calc(94vh - 94px)",
    display: "flex",
    overflow: "hidden",
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  sidebar: {
    width: 340,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
    py: 2,
  },
  sidebarList: {
    flex: 1,
    overflowY: "auto",
    px: 1,
    py: 1,
  },
  conversationButton: {
    borderRadius: 2,
    mb: 0.5,
    alignItems: "flex-start",
    px: 1.5,
    py: 1.25,
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    bgcolor: "#fafafa",
  },
  chatHeader: {
    px: 3,
    py: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    px: 3,
    py: 2,
  },
  composer: {
    p: 2,
    borderTop: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "background.default",
    },
  },
};

const ChatInterno = () => {
  const { user } = useUser();

  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] =
    useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [flushHook, setFlushHook] = useState(false);

  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null,
  );
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);

  const rawToken = localStorage.getItem("token") || "";
  const token = rawToken.replace(/^Bearer\s+/i, "");
  const conversaIdSelecionada = conversaSelecionada?.id ?? null;

  const conversaAtualRef = useRef<string | null>(null);

  const LIMITE_ARQUIVO = 15 * 1024 * 1024;

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (file.size > LIMITE_ARQUIVO) {
      alert("O arquivo deve ter no máximo 15MB.");
      e.target.value = "";
      return;
    }

    setArquivoSelecionado(file);
  };

  const removerArquivoSelecionado = () => {
    setArquivoSelecionado(null);
    const input = document.getElementById(
      "input-arquivo-chat",
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  useEffect(() => {
    conversaAtualRef.current = conversaIdSelecionada;
  }, [conversaIdSelecionada]);

  const carregarConversas = async () => {
    const data = await ConversaService.listarMinhasConversas();
    setConversas(data);
  };

  const carregarMensagens = async (conversaId: string) => {
    const data = await MensagemService.listarMensagens(conversaId);
    setMensagens(data);
  };

  useEffect(() => {
    carregarConversas();
  }, [flushHook]);

  useEffect(() => {
    if (!token) return;

    const socket = SocketChatService.connect(token);

    const handleConnect = () => {
      console.log("Socket conectado:", socket.id);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Socket desconectado:", reason);

      if (reason === "io server disconnect") {
        socket.connect();
      }
    };

    const handleConnectError = (err: any) => {
      console.error("connect_error:", err.message, err);
    };

    const handleErroBackend = (payload: any) => {
      console.error("erro do backend:", payload);
    };

    const handleNovaMensagem = (mensagem: Mensagem) => {
      if (mensagem.conversaId === conversaAtualRef.current) {
        setMensagens((prev) => [...prev, mensagem]);
      }

      carregarConversas();
    };

    const handleConversaAtualizada = () => {
      carregarConversas();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("erro", handleErroBackend);

    SocketChatService.onNovaMensagem(handleNovaMensagem);
    SocketChatService.onConversaAtualizada(handleConversaAtualizada);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("erro", handleErroBackend);
      SocketChatService.offNovaMensagem(handleNovaMensagem);
      SocketChatService.offConversaAtualizada(handleConversaAtualizada);
      SocketChatService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!conversaIdSelecionada || !token) return;

    carregarMensagens(conversaIdSelecionada);
    ConversaService.marcarComoLida(conversaIdSelecionada);

    const socket = SocketChatService.getSocket();
    if (socket?.connected) {
      SocketChatService.entrarNaConversa(conversaIdSelecionada, (response) => {
        console.log("ACK conversa:entrar", response);
      });
    } else {
      console.warn("Socket ainda não conectado ao entrar na conversa");
    }

    return () => {
      SocketChatService.sairDaConversa(conversaIdSelecionada);
    };
  }, [conversaIdSelecionada, token, flushHook]);

  const enviarMensagem = async () => {
    const conteudo = novaMensagem.trim();

    if (!conversaIdSelecionada) return;
    if (!conteudo && !arquivoSelecionado) return;

    try {
      setEnviandoArquivo(true);

      let uploadData: any = null;

      if (arquivoSelecionado) {
        const formData = new FormData();
        formData.append("file", arquivoSelecionado);

        uploadData = await MensagemService.uploadArquivo(formData);
      }

      SocketChatService.enviarMensagem(
        {
          conversaId: conversaIdSelecionada,
          conteudo: conteudo || undefined,
          tipo: uploadData?.tipo || "TEXTO",
          arquivoUrl: uploadData?.arquivoUrl || undefined,
          nomeArquivo: uploadData?.nomeArquivo || undefined,
          nomeSalvo: uploadData?.nomeSalvo || undefined,
          mimeType: uploadData?.mimeType || undefined,
          tamanhoBytes: uploadData?.tamanhoBytes || undefined,
        },
        (response) => {
          console.log("ACK mensagem:enviar", response);

          if (!response?.ok) {
            console.error("Erro ao enviar mensagem:", response);
          }
        },
      );

      setNovaMensagem("");
      removerArquivoSelecionado();
    } catch (error) {
      console.error("Erro ao enviar mensagem com arquivo:", error);
    } finally {
      setEnviandoArquivo(false);
    }
  };

  const meuUsuario = user;

  const getParticipantesDaConversa = (conversa?: Conversa | null) => {
    if (!conversa) return [];
    return conversa.participantes || conversa.ParticipanteConversa || [];
  };

  const getUsuarioDoParticipante = (
    participante?: ParticipanteConversa | null,
  ) => {
    if (!participante) return undefined;
    return participante.usuario || participante.UsuarioChat;
  };

  const getNomeConversaExibicao = (conversa?: Conversa | null) => {
    if (!conversa) return "Selecione uma conversa";

    if (conversa.tipo === "GRUPO") {
      return conversa.nome || "Grupo";
    }

    const participantes = getParticipantesDaConversa(conversa);

    if (!participantes.length) {
      return conversa.nome || "Conversa";
    }

    const outroParticipante = participantes.find((participante) => {
      const usuarioParticipante = getUsuarioDoParticipante(participante);

      if (!usuarioParticipante) return false;

      if (meuUsuario?.id) {
        return usuarioParticipante.id !== meuUsuario.id;
      }

      if ((meuUsuario as any)?.adObjectGuid) {
        return (
          (usuarioParticipante as any).adObjectGuid !==
          (meuUsuario as any).adObjectGuid
        );
      }

      return true;
    });

    const usuarioOutroParticipante =
      getUsuarioDoParticipante(outroParticipante);

    return (
      usuarioOutroParticipante?.nome ||
      usuarioOutroParticipante?.usuario ||
      usuarioOutroParticipante?.email ||
      conversa.nome ||
      "Conversa"
    );
  };

  const nomeConversa = useMemo(() => {
    return getNomeConversaExibicao(conversaSelecionada);
  }, [conversaSelecionada, flushHook]);

  const getNomeRemetente = (mensagem: Mensagem) =>
    mensagem.UsuarioChat?.nome || "Usuário";

  const getConteudoMensagem = (mensagem: Mensagem) =>
    mensagem.excluida || mensagem.deletedAt
      ? "Mensagem excluída"
      : mensagem.conteudo;

  const getIniciais = (nome?: string) => {
    if (!nome) return "?";

    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join("");
  };

  const formatarTamanhoArquivo = (bytes?: number | null) => {
    if (!bytes) return "";

    const mb = bytes / 1024 / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;

    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  const getArquivoUrl = (mensagem: Mensagem) => {
    if (!mensagem.arquivoUrl) return "";

    if (
      mensagem.arquivoUrl.startsWith("http://") ||
      mensagem.arquivoUrl.startsWith("https://")
    ) {
      return mensagem.arquivoUrl;
    }

    const baseUrl = import.meta.env.VITE_API_BACKEND_CHAT_INTERNO;

    return `${baseUrl}${mensagem.arquivoUrl}`;
  };

  const isMensagemImagem = (mensagem: Mensagem) => {
    if (mensagem.tipo === "IMAGEM") return true;

    if (mensagem.mimeType?.startsWith("image/")) return true;

    const nome =
      `${mensagem.nomeArquivo || ""} ${mensagem.arquivoUrl || ""}`.toLowerCase();

    return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"].some(
      (ext) => nome.includes(ext),
    );
  };

  return (
    <SidebarNew>
      <Container maxWidth={false}>
        <Paper sx={styles.rootPaper}>
          <Box sx={styles.sidebar}>
            <Box sx={styles.sidebarHeader}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Chat Interno
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Converse com sua equipe
                </Typography>
              </Box>

              <ModalCreateNovaConversa setFlushHook={setFlushHook} />
            </Box>

            <Divider />

            <List sx={styles.sidebarList}>
              {conversas.map((conversa) => {
                const selecionada = conversaSelecionada?.id === conversa.id;
                const unreadCount = conversa.quantidadeNaoLidas || 0;
                const nome = getNomeConversaExibicao(conversa);

                return (
                  <ListItemButton
                    key={conversa.id}
                    selected={selecionada}
                    onClick={() => setConversaSelecionada(conversa)}
                    sx={{
                      ...styles.conversationButton,
                      border: "1px solid",
                      borderColor: selecionada ? "primary.main" : "transparent",
                      bgcolor: selecionada ? "action.selected" : "transparent",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={selecionada ? 700 : 500}
                            noWrap
                          >
                            {nome}
                          </Typography>

                          {unreadCount > 0 && (
                            <Badge
                              badgeContent={unreadCount}
                              color="primary"
                              sx={{
                                "& .MuiBadge-badge": {
                                  position: "static",
                                  transform: "none",
                                },
                              }}
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {conversa.tipo === "GRUPO"
                            ? "Grupo"
                            : "Conversa direta"}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>

          <Box sx={styles.chatArea}>
            <Box sx={styles.chatHeader}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {nomeConversa}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conversaSelecionada
                      ? "Mensagens da conversa selecionada"
                      : "Escolha uma conversa para começar"}
                  </Typography>
                </Box>
                {conversaSelecionada &&
                  conversaSelecionada.tipo === "GRUPO" && (
                    <ModalGrupo
                      conversa={conversaSelecionada}
                      usuarioLogadoId={user?.adObjectGuid}
                      isFlushHook={setFlushHook}
                    />
                  )}
              </Box>
            </Box>

            <Box sx={styles.messagesArea}>
              {!conversaSelecionada ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  sx={{ height: "100%", color: "text.secondary" }}
                >
                  <ForumOutlinedIcon sx={{ fontSize: 48, opacity: 0.6 }} />
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Nenhuma conversa selecionada
                    </Typography>
                    <Typography variant="body2">
                      Selecione uma conversa na lateral para visualizar as
                      mensagens.
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {mensagens.map((mensagem) => {
                    const remetenteNome = getNomeRemetente(mensagem);
                    const conteudo = getConteudoMensagem(mensagem);
                    const mensagemExcluida =
                      mensagem.excluida || Boolean(mensagem.deletedAt);
                    const isMinhaMensagem =
                      mensagem.UsuarioChat?.adObjectGuid ===
                      meuUsuario?.adObjectGuid;

                    return (
                      <Stack
                        key={mensagem.id}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        justifyContent={
                          isMinhaMensagem ? "flex-end" : "flex-start"
                        }
                      >
                        {!isMinhaMensagem && (
                          <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                            {getIniciais(remetenteNome)}
                          </Avatar>
                        )}

                        <Paper
                          elevation={0}
                          sx={{
                            px: 2,
                            py: 1.5,
                            maxWidth: 680,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: isMinhaMensagem
                              ? "info.main"
                              : "divider",
                            bgcolor: mensagemExcluida
                              ? "action.hover"
                              : isMinhaMensagem
                                ? blue[200]
                                : "background.paper",
                            color: isMinhaMensagem
                              ? "info.contrastText"
                              : "text.primary",
                          }}
                        >
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              mb: 0.5,
                              fontWeight: 700,
                              color: "text.secondary",
                            }}
                          >
                            {remetenteNome}
                          </Typography>

                          <Box>
                            {isMensagemImagem(mensagem) &&
                            mensagem.arquivoUrl &&
                            !mensagemExcluida ? (
                              <>
                                {conteudo && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1,
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {conteudo}
                                  </Typography>
                                )}

                                <Box
                                  component="img"
                                  src={getArquivoUrl(mensagem)}
                                  alt={mensagem.nomeArquivo || "Imagem"}
                                  sx={{
                                    maxWidth: 320,
                                    width: "100%",
                                    borderRadius: 2,
                                    display: "block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    window.open(
                                      getArquivoUrl(mensagem),
                                      "_blank",
                                    )
                                  }
                                />
                              </>
                            ) : mensagem.arquivoUrl && !mensagemExcluida ? (
                              <>
                                {conteudo && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mb: 1,
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {conteudo}
                                  </Typography>
                                )}

                                <Paper
                                  variant="outlined"
                                  sx={{
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 2,
                                    bgcolor: "background.default",
                                  }}
                                >
                                  <a
                                    href={getArquivoUrl(mensagem)}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      {mensagem.nomeArquivo || "Abrir arquivo"}
                                    </Typography>
                                  </a>

                                  {mensagem.tamanhoBytes ? (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {formatarTamanhoArquivo(
                                        mensagem.tamanhoBytes,
                                      )}
                                    </Typography>
                                  ) : null}
                                </Paper>
                              </>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  fontStyle: mensagemExcluida
                                    ? "italic"
                                    : "normal",
                                  color: mensagemExcluida
                                    ? "text.secondary"
                                    : "text.primary",
                                }}
                              >
                                {conteudo}
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Box>

            <Box sx={styles.composer}>
              <Stack spacing={1}>
                {arquivoSelecionado && (
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" noWrap>
                          {arquivoSelecionado.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatarTamanhoArquivo(arquivoSelecionado.size)}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={removerArquivoSelecionado}
                        disabled={enviandoArquivo}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                  <input
                    id="input-arquivo-chat"
                    type="file"
                    hidden
                    onChange={handleSelecionarArquivo}
                  />

                  <label htmlFor="input-arquivo-chat">
                    <Tooltip title="Adicionar Imagem">
                      <IconButton
                        component="span"
                        disabled={!conversaSelecionada || enviandoArquivo}
                        sx={{
                          width: 55,
                          height: 55,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                        }}
                      >
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                  </label>

                  <EmojiPicker
                    disabled={!conversaSelecionada || enviandoArquivo}
                    onSelect={(emoji) =>
                      setNovaMensagem((prev) => `${prev}${emoji}`)
                    }
                  />

                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        enviarMensagem();
                      }
                    }}
                    sx={styles.input}
                    disabled={!conversaSelecionada || enviandoArquivo}
                  />

                  <IconButton
                    color="primary"
                    onClick={enviarMensagem}
                    disabled={
                      !conversaSelecionada ||
                      enviandoArquivo ||
                      (!novaMensagem.trim() && !arquivoSelecionado)
                    }
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <SendRoundedIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </SidebarNew>
  );
};

export default ChatInterno;
