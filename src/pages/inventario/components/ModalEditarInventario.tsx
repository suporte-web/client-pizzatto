import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { InventarioService } from "../../../stores/inventario/service"; // Ajuste o caminho conforme necessário

const ModalEditarInventario = ({ item, showToast, setFlushHook }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para os campos do formulário
  const [equipamento, setEquipamento] = useState("");
  const [patrimonio, setPatrimonio] = useState("");
  const [tag, setTag] = useState("");
  const [setor, setSetor] = useState("");
  const [nomeComputador, setNomeComputador] = useState("");
  const [nomeColaborador, setNomeColaborador] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [status, setStatus] = useState("");
  const [descricao, setDescricao] = useState("");

  // Inicializa os estados quando o item é passado ou quando abre o modal
  useEffect(() => {
    if (item && open) {
      setEquipamento(item.equipamento || "");
      setPatrimonio(item.patrimonio || "");
      setTag(item.tag || "");
      setSetor(item.setor || "");
      setNomeComputador(item.nomeComputador || "");
      setNomeColaborador(item.nomeColaborador || "");
      setLocalizacao(item.localizacao || "");
      setDataEntrega(item.dataEntrega ? item.dataEntrega.split("T")[0] : "");
      setStatus(item.status || "");
      setDescricao(item.descricao || "");
    }
  }, [item, open]);

  const handleClose = () => {
    setOpen(false);
    // Reset dos estados quando fechar
    setTimeout(() => {
      setEquipamento("");
      setPatrimonio("");
      setTag("");
      setSetor("");
      setNomeComputador("");
      setNomeColaborador("");
      setLocalizacao("");
      setDataEntrega("");
      setStatus("");
      setDescricao("");
    }, 300);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEditarInventario = async () => {
    try {
      setLoading(true);

      // Preparar dados para envio
      const dadosAtualizados = {
        equipamento: equipamento || undefined,
        patrimonio: patrimonio || undefined,
        tag: tag || undefined,
        setor: setor || undefined,
        nomeComputador: nomeComputador || undefined,
        nomeColaborador: nomeColaborador || undefined,
        localizacao: localizacao || undefined,
        status: status || undefined,
        dataEntrega: dataEntrega ? new Date(dataEntrega).toISOString() : undefined,
        descricao: descricao ? descricao : undefined,
      };

      console.log("Dados sendo atualizados:", dadosAtualizados);

      // Chamar o serviço de atualização
      await InventarioService.update({ _id: item._id, ...dadosAtualizados });

      showToast("Inventário atualizado com sucesso!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao atualizar inventário:", error);
      showToast("Erro ao atualizar inventário!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Editar Inventário">
        <IconButton
          onClick={handleOpen}
          color="primary"
          size="small"
          sx={{
            "&:hover": {
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "12px",
            m: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Editar Inventário
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {/* Equipamento */}
            <FormControl size="small" fullWidth>
              <InputLabel>Equipamento</InputLabel>
              <Select
                label="Equipamento"
                value={equipamento}
                onChange={(e) => setEquipamento(e.target.value)}
                sx={{ borderRadius: "10px" }}
              >
                {[
                  "DESKTOP",
                  "NOTEBOOK",
                  "MONITOR",
                  "HEADSET",
                  "MOUSE",
                  "TECLADO",
                  "TELEFONE CORPORATIVO",
                  "IMPRESSORA",
                  "SCANNER",
                  "TABLET",
                  "SERVIDOR",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Patrimônio e Tag */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                size="small"
                label="Patrimônio"
                fullWidth
                value={patrimonio}
                onChange={(e) => setPatrimonio(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />

              <TextField
                size="small"
                label="Tag"
                fullWidth
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Box>

            {/* Setor e Localização */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                size="small"
                label="Setor"
                fullWidth
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />

              <TextField
                size="small"
                label="Localização"
                fullWidth
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Box>

            {/* Nome do Computador e Colaborador */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                size="small"
                label="Nome do Computador"
                fullWidth
                value={nomeComputador}
                onChange={(e) => setNomeComputador(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />

              <TextField
                size="small"
                label="Nome do Colaborador"
                fullWidth
                value={nomeColaborador}
                onChange={(e) => setNomeColaborador(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Box>

            {/* Data de Compra e Data de Garantia */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                size="small"
                label="Data de Entrega"
                type="date"
                fullWidth
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
                InputLabelProps={{ shrink: true }}
              />

            </Box>

            {/* Status */}
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ borderRadius: "10px" }}
              >
                {[
                  "EM USO",
                  "EM ESTOQUE",
                  "EM MANUTENÇÃO",
                  "DESCONTINUADO",
                  "FORA DE OPERAÇÃO",
                  "FURTADO",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
                size="small"
                label="Descrição"
                type="text"
                fullWidth
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                InputProps={{ style: { borderRadius: "10px" } }}
                multiline
                rows={3}
              />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            gap: 1,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              flex: isMobile ? 1 : "none",
              width: isMobile ? "100%" : "auto",
              minHeight: isMobile ? "44px" : "auto",
            }}
            disabled={loading}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleEditarInventario}
            sx={{
              borderRadius: "10px",
              flex: isMobile ? 1 : "none",
              width: isMobile ? "100%" : "auto",
              minHeight: isMobile ? "44px" : "auto",
            }}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarInventario;
