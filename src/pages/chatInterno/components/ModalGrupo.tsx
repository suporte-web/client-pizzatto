import { Group, Delete, PersonAdd, FlakyOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ColaboradorChatService } from "../../../stores/chatInterno/colaboradorChatService";
import { ConversaService } from "../../../stores/chatInterno/conversaService";
import { useToast } from "../../../components/Toast";

type UsuarioChat = {
  id: string;
  nome: string;
  email: string | null;
  adObjectGuid?: string;
};

type ParticipanteConversa = {
  id: string;
  conversaId: string;
  usuarioId: string;
  admin: boolean;
  UsuarioChat: UsuarioChat;
};

const ModalGrupo = ({ conversa, usuarioLogadoId, isFlushHook }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const [novoNome, setNovoNome] = useState(conversa.nome);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
  const [participantes, setParticipantes] = useState<ParticipanteConversa[]>(
    conversa.ParticipanteConversa || [],
  );
  const [todosUsuarios, setTodosUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [flushHook, setFlushHook] = useState(false);

  const carregarColaboradores = async () => {
    try {
      setLoading(true);
      const data = await ColaboradorChatService.listarAtivos();
      setTodosUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      carregarColaboradores();
    }
  }, [open]);

  const colaboradoresOrdenados = useMemo(() => {
    return [...todosUsuarios].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [todosUsuarios, flushHook]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isAdmin = participantes.some(
    (p) => p.UsuarioChat?.adObjectGuid === usuarioLogadoId && p.admin,
  );

  const admins = participantes.filter((p) => p.admin);

  const usuariosDisponiveis = useMemo(() => {
    return colaboradoresOrdenados.filter(
      (user: any) =>
        !participantes.some(
          (participante) =>
            participante?.UsuarioChat?.adObjectGuid === user.adObjectGuid,
        ),
    );
  }, [colaboradoresOrdenados, participantes, flushHook]);

  const carregarParticipantes = async () => {
    try {
      const conversaAtualizada = await ConversaService.buscarPorId(conversa.id);
      setParticipantes(conversaAtualizada.ParticipanteConversa || []);
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    }
  };

  const handleAdicionarUsuario = async () => {
    if (!colaboradorSelecionado) return;

    try {
      const usuario: any = colaboradorSelecionado;

      await ConversaService.adicionarParticipante({
        conversaId: conversa.id,
        usuarioId: usuario.id,
      });

      setFlushHook((prev: any) => !prev);

      await carregarParticipantes();

      showToast("Sucesso ao Adicionar Participante", "success");
      setColaboradorSelecionado(null);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      showToast("Erro ao Adicionar Participante", "error");
    }
  };

  useEffect(() => {
    setNovoNome(conversa.nome);
    setParticipantes(conversa.ParticipanteConversa || []);
  }, [conversa]);

  const handleRemoverUsuario = async (participanteId: string) => {
    try {
      const participante = participantes.find((p) => p.id === participanteId);
      if (!participante) return;

      if (participante.admin && admins.length === 1) {
        showToast("Não é possível remover o último administrador", "warning");
        return;
      }

      await ConversaService.removerParticipantes(participanteId);

      setParticipantes((prev) => prev.filter((p) => p.id !== participanteId));

      showToast("Participante removido com sucesso", "success");
    } catch (error) {
      console.error("Erro ao remover participante:", error);
      showToast("Erro ao remover participante", "error");
    }
  };

  const handleToggleAdmin = async (participanteId: string) => {
    try {
      const participante = participantes.find((p) => p.id === participanteId);
      if (!participante) return;

      // regra: não remover último admin
      if (participante.admin && admins.length === 1) return;

      const novoValor = !participante.admin;

      await ConversaService.alterarAdminParticipantes({
        id: participante.id,
        admin: novoValor,
      });

      setParticipantes((prev) =>
        prev.map((p) =>
          p.id === participante.id ? { ...p, admin: novoValor } : p,
        ),
      );

      showToast("Permissão atualizada com sucesso", "success");
    } catch (error) {
      console.error("Erro ao alterar admin:", error);
      showToast("Erro ao alterar permissão", "error");
    }
  };

  const handleSalvar = async () => {
    try {
      await ConversaService.changeNomeGrupo({
        id: conversa.id,
        nome: novoNome,
      });

      showToast("Nome do grupo atualizado com sucesso", "success");
      isFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao alterar nome do grupo:", error);
      showToast("Erro ao alterar nome do grupo", "error");
    }
  };

  return (
    <>
      <Tooltip title="Informações do Grupo">
        <IconButton onClick={handleOpen}>
          <Group />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Informações do Grupo</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Nome do grupo"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              fullWidth
              disabled={!isAdmin}
            />

            <Box>
              <Typography variant="subtitle2" mb={1}>
                Administradores
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {admins.map((admin) => (
                  <Chip
                    key={admin.usuarioId}
                    label={admin.UsuarioChat.nome}
                    color="primary"
                    size="small"
                  />
                ))}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" mb={1}>
                Usuários no grupo
              </Typography>

              <List sx={{ p: 0 }}>
                {participantes.map((participante) => {
                  const isUltimoAdmin =
                    participante.admin && admins.length === 1;

                  return (
                    <ListItem
                      key={participante.id}
                      divider
                      secondaryAction={
                        isAdmin ? (
                          <Stack direction="row" spacing={1}>
                            <Tooltip
                              title={
                                participante.admin
                                  ? "Remover Admin"
                                  : "Tornar Admin"
                              }
                            >
                              <IconButton
                                size="small"
                                color={participante.admin ? "error" : "success"}
                                onClick={() =>
                                  handleToggleAdmin(participante.id)
                                }
                                disabled={!isAdmin || isUltimoAdmin}
                              >
                                <FlakyOutlined />
                              </IconButton>
                            </Tooltip>

                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() =>
                                handleRemoverUsuario(participante.id)
                              }
                              disabled={!isAdmin || isUltimoAdmin}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {participante.UsuarioChat.nome?.charAt(0) || "U"}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography>
                              {participante.UsuarioChat.nome}
                            </Typography>
                            {participante.admin && (
                              <Chip
                                label="Administrador"
                                color="primary"
                                size="small"
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          participante.UsuarioChat.email || "Sem e-mail"
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {isAdmin && (
              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Adicionar usuário
                </Typography>

                <Stack spacing={1}>
                  <Autocomplete
                    options={usuariosDisponiveis}
                    loading={loading}
                    value={colaboradorSelecionado}
                    onChange={(_, value) => setColaboradorSelecionado(value)}
                    getOptionLabel={(option) =>
                      `${option.nome}${option.email ? ` - ${option.email}` : ""}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.adObjectGuid === value.adObjectGuid
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Colaborador"
                        placeholder="Busque um colaborador"
                      />
                    )}
                  />

                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleAdicionarUsuario}
                    disabled={!colaboradorSelecionado}
                  >
                    Adicionar
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          {isAdmin && (
            <Button variant="contained" onClick={handleSalvar}>
              Salvar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalGrupo;
