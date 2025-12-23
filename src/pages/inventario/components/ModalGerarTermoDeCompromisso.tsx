import { PictureAsPdf } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { GlpiService } from "../../../stores/glpi/service";

const ModalGerarTermoCompromisso = ({
  item,
  showToast,
  setFlushHook,
  flushHook,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form
  const [colaborador, setColaborador] = useState("");

  const [notebookActive, setNotebookActive] = useState(false);
  const [mouseActive, setMouseActive] = useState(false);
  const [tecladoActive, setTecladoActive] = useState(false);

  const [monitorActive, setMonitorActive] = useState(false);
  const [monitor, setMonitor] = useState("Monitor Dell 24 Polegadas");

  const [headsetActive, setHeadsetActive] = useState(false);
  const [headset, setHeadset] = useState("Headset com fio USB Logitech H390");

  const [suporteNotebookActive, setSuporteNotebookActive] = useState(false);

  const [celularActive, setCelularActive] = useState(false);
  const [carregadorCelularActive, setCarregadorCelularActive] = useState(false);
  const [chipCelularActive, setChipCelularActive] = useState(false);
  const [chipCelular, setChipCelular] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [modeloCelular, setModeloCelular] = useState("");
  const [imeiCelular1, setImeiCelular1] = useState("");
  const [imeiCelular2, setImeiCelular2] = useState("");

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (!colaborador.trim()) return false;
    if (monitorActive && !monitor.trim()) return false;
    if (headsetActive && !headset.trim()) return false;
    if (celularActive) {
      if (!modeloCelular.trim()) return false;
      if (!imeiCelular1.trim()) return false;
      // IMEI 2 pode ser opcional — ajuste se quiser exigir também
    }
    return true;
  }, [
    loading,
    colaborador,
    monitorActive,
    monitor,
    headsetActive,
    headset,
    celularActive,
    modeloCelular,
    imeiCelular1,
  ]);

  const handleCreatePdfTermo = async () => {
    try {
      setLoading(true);

      const response = await GlpiService.createTermoCompromisso({
        id: item?.id,
        colaborador,
        notebookActive,
        mouseActive,
        tecladoActive,
        monitorActive,
        monitor,
        headsetActive,
        headset,
        suporteNotebookActive,
        celularActive,
        carregadorCelularActive,
        modeloCelular,
        imeiCelular1,
        imeiCelular2,
        chipCelularActive,
        chipCelular,
      });

      if (!response?.pdfBase64) throw new Error("Resposta vazia do servidor");

      const byteCharacters = atob(response.pdfBase64);
      const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
      if (pdfBlob.size === 0) throw new Error("Arquivo PDF vazio");

      handleDownload({
        pdfBlob,
        colaborador: response.colaborador || colaborador,
      });
    } catch (error) {
      console.log(error);
      showToast("Não foi possível gerar o termo. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (blob: any) => {
    const blobUrl = URL.createObjectURL(blob.pdfBlob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `Termo-de-Notebook - ${blob.colaborador}.pdf`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    showToast("Contrato gerado com sucesso!", "success");
    setFlushHook(!flushHook);
    handleClose();
  };

  // Styles (centralizados pra ficar mais limpo)
  const sx = {
    iconBtn: {
      "&:hover": {
        backgroundColor: "error.light",
        color: "error.contrastText",
      },
    },
    dialogPaper: {
      borderRadius: isMobile ? 0 : 3,
      m: isMobile ? 0 : 2,
      overflow: "hidden",
    },
    header: {
      px: 3,
      py: 2,
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
          : "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0))",
    },
    content: { px: 3, py: 2.5 },
    sectionTitle: { fontWeight: 700, fontSize: 13, color: "text.secondary" },
    fieldGrid: {
      display: "grid",
      gap: 2,
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
      alignItems: "start",
    },
    checksGrid: {
      display: "grid",
      gap: 0.5,
      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, // 3 por linha no desktop
      alignItems: "center",
      "& .MuiFormControlLabel-root": {
        m: 0,
        px: 1,
        py: 0.25,
        borderRadius: 2,
        transition: "background 120ms ease",
        "&:hover": { backgroundColor: "action.hover" },
      },
      "& .MuiCheckbox-root": { py: 0.5 },
      "& .MuiFormControlLabel-label": { fontSize: 14 },
    },
    actions: {
      px: 3,
      pb: 3,
      pt: 1.5,
      gap: 1,
      flexDirection: isMobile ? "column" : "row",
    },
    btn: {
      borderRadius: 2.5,
      minHeight: isMobile ? 44 : 40,
      px: 2.25,
    },
    btnFull: { width: isMobile ? "100%" : "auto" },
  } as const;

  return (
    <>
      <Tooltip title="Gerar Termo de Compromisso">
        <IconButton
          onClick={handleOpen}
          color="error"
          size="small"
          sx={sx.iconBtn}
        >
          <PictureAsPdf fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: sx.dialogPaper }}
      >
        <DialogTitle sx={sx.header}>
          <Typography
            sx={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Gerar Termo de Compromisso
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
            Selecione os itens e preencha os detalhes necessários para gerar o
            PDF.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={sx.content}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={sx.sectionTitle}>Colaborador</Typography>
              <TextField
                size="small"
                label="Nome do colaborador"
                fullWidth
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                placeholder="Ex.: João Silva"
                InputProps={{ sx: { borderRadius: 2.5 } }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={sx.sectionTitle}>Itens</Typography>

              <Box sx={sx.checksGrid}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notebookActive}
                      onChange={(e) => setNotebookActive(e.target.checked)}
                    />
                  }
                  label="Notebook"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mouseActive}
                      onChange={(e) => setMouseActive(e.target.checked)}
                    />
                  }
                  label="Mouse"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tecladoActive}
                      onChange={(e) => setTecladoActive(e.target.checked)}
                    />
                  }
                  label="Teclado"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={monitorActive}
                      onChange={(e) => setMonitorActive(e.target.checked)}
                    />
                  }
                  label="Monitor"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={headsetActive}
                      onChange={(e) => setHeadsetActive(e.target.checked)}
                    />
                  }
                  label="Headset"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={suporteNotebookActive}
                      onChange={(e) =>
                        setSuporteNotebookActive(e.target.checked)
                      }
                    />
                  }
                  label="Suporte notebook"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={celularActive}
                      onChange={(e) => setCelularActive(e.target.checked)}
                    />
                  }
                  label="Celular"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={carregadorCelularActive}
                      onChange={(e) =>
                        setCarregadorCelularActive(e.target.checked)
                      }
                    />
                  }
                  label="Carregador celular"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chipCelularActive}
                      onChange={(e) => setChipCelularActive(e.target.checked)}
                    />
                  }
                  label="Chip"
                />
              </Box>
            </Box>

            {(monitorActive || headsetActive || celularActive) && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                <Typography sx={sx.sectionTitle}>Detalhes</Typography>

                <Box sx={sx.fieldGrid}>
                  {monitorActive && (
                    <TextField
                      size="small"
                      label="Modelo do monitor"
                      fullWidth
                      value={monitor}
                      onChange={(e) => setMonitor(e.target.value)}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                    />
                  )}

                  {headsetActive && (
                    <TextField
                      size="small"
                      label="Modelo do headset"
                      fullWidth
                      value={headset}
                      onChange={(e) => setHeadset(e.target.value)}
                      InputProps={{ sx: { borderRadius: 2.5 } }}
                    />
                  )}

                  {celularActive && (
                    <>
                      <TextField
                        size="small"
                        label="Modelo do celular"
                        fullWidth
                        value={modeloCelular}
                        onChange={(e) => setModeloCelular(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2.5 } }}
                      />

                      <TextField
                        size="small"
                        label="IMEI 1"
                        fullWidth
                        value={imeiCelular1}
                        onChange={(e) => setImeiCelular1(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2.5 } }}
                      />

                      <TextField
                        size="small"
                        label="IMEI 2 (opcional)"
                        fullWidth
                        value={imeiCelular2}
                        onChange={(e) => setImeiCelular2(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2.5 } }}
                      />

                      <TextField
                        size="small"
                        label="SN (Serial Number)"
                        fullWidth
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2.5 } }}
                      />
                    </>
                  )}
                </Box>
                {chipCelularActive && (
                    <>
                      <TextField
                        size="small"
                        label="Chip"
                        fullWidth
                        value={chipCelular}
                        onChange={(e) => setChipCelular(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2.5 } }}
                      />
                    </>
                  )}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={sx.actions}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ ...sx.btn, ...sx.btnFull }}
            disabled={loading}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreatePdfTermo}
            sx={{ ...sx.btn, ...sx.btnFull }}
            disabled={!canSubmit}
          >
            {loading ? <CircularProgress size={22} /> : "Gerar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalGerarTermoCompromisso;
