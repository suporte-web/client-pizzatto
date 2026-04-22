import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { ColaboradorChatService } from "../../../stores/chatInterno/colaboradorChatService";
import { ConversaService } from "../../../stores/chatInterno/conversaService";

type Colaborador = {
  id: string;
  adObjectGuid: string;
  nome: string;
  email?: string | null;
  usuario?: string;
  ativo?: boolean;
};

export default function ModalCreateNovaConversa({
  onConversaCriada,
  setFlushHook,
}: any) {
  const [open, setOpen] = useState(false);
  const [aba, setAba] = useState<"direta" | "grupo">("direta");
  const [loading, setLoading] = useState(false);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] =
    useState<Colaborador | null>(null);
  const [colaboradoresGrupo, setColaboradoresGrupo] = useState<Colaborador[]>(
    [],
  );
  const [nomeGrupo, setNomeGrupo] = useState("");

  const carregarColaboradores = async () => {
    try {
      setLoading(true);
      const data = await ColaboradorChatService.listarAtivos();
      setColaboradores(data || []);
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
    return [...colaboradores].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [colaboradores]);

  const handleClose = () => {
    setOpen(false);
    setAba("direta");
    setColaboradorSelecionado(null);
    setColaboradoresGrupo([]);
    setNomeGrupo("");
  };

  const criarConversaDireta = async () => {
    if (!colaboradorSelecionado?.adObjectGuid) return;

    try {
      const conversa = await ConversaService.criarDireta({
        adObjectGuidDestino: colaboradorSelecionado.adObjectGuid,
      });

      onConversaCriada?.(conversa);
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar conversa direta:", error);
    }
  };

  const criarGrupo = async () => {
    if (!nomeGrupo.trim() || colaboradoresGrupo.length === 0) return;

    try {
      const conversa = await ConversaService.criarGrupo({
        nome: nomeGrupo.trim(),
        adObjectGuidsParticipantes: colaboradoresGrupo.map(
          (colaborador) => colaborador.adObjectGuid,
        ),
      });

      onConversaCriada?.(conversa);
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  const acaoDesabilitada =
    aba === "direta"
      ? !colaboradorSelecionado
      : !nomeGrupo.trim() || colaboradoresGrupo.length === 0;

  return (
    <>
      <Tooltip title={"Nova Conversa"}>
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <AddCommentIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nova conversa</DialogTitle>

        <DialogContent>
          <Tabs
            value={aba}
            onChange={(_, value) => setAba(value)}
            sx={{ mb: 2 }}
          >
            <Tab label="Conversa" value="direta" />
            <Tab label="Grupo" value="grupo" />
          </Tabs>

          {aba === "direta" && (
            <Stack spacing={2}>
              <Typography variant="body2">
                Selecione um colaborador para iniciar uma conversa.
              </Typography>

              <Autocomplete
                options={colaboradoresOrdenados}
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
            </Stack>
          )}

          {aba === "grupo" && (
            <Stack spacing={2}>
              <TextField
                label="Nome do grupo"
                value={nomeGrupo}
                onChange={(e) => setNomeGrupo(e.target.value)}
                fullWidth
              />

              <Autocomplete
                multiple
                options={colaboradoresOrdenados}
                loading={loading}
                value={colaboradoresGrupo}
                onChange={(_, value) => setColaboradoresGrupo(value)}
                getOptionLabel={(option) =>
                  `${option.nome}${option.email ? ` - ${option.email}` : ""}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.adObjectGuid === value.adObjectGuid
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.adObjectGuid}
                      label={option.nome}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Participantes"
                    placeholder="Selecione os participantes"
                  />
                )}
              />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Participantes selecionados: {colaboradoresGrupo.length}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>

          <Button
            variant="contained"
            onClick={aba === "direta" ? criarConversaDireta : criarGrupo}
            disabled={acaoDesabilitada}
          >
            {aba === "direta" ? "Criar conversa" : "Criar grupo"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
