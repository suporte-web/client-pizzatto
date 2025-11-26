import { AssistantOutlined } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ContratosService } from "../../../../stores/contrato/serviceContratos";

const ModalPromptGeradorClausulas = ({
  contrato,
  showToast,
  setFlushHook,
}: any) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clausulaSigilo, setClausulaSigilo] = useState(
    !!contrato?.clausulaSigilo
  );
  const [servicosPrestados, setServicosPrestados] = useState(
    contrato?.servicosPrestados || ""
  );
  const [obrigacaoContrato, setObrigacaoContrato] = useState(
    contrato?.obrigacaoContrato || ""
  );

  // Estado para exibir o texto gerado pela IA dentro do Dialog
  const [clausulasIaTexto, setClausulasIaTexto] = useState(
    contrato?.clausulasIa || ""
  );

  // Sempre que o contrato mudar, sincroniza os campos locais
  useEffect(() => {
    setClausulaSigilo(!!contrato?.clausulaSigilo);
    setServicosPrestados(contrato?.servicosPrestados || "");
    setObrigacaoContrato(contrato?.obrigacaoContrato || "");
    setClausulasIaTexto(contrato?.clausulasIa || "");
  }, [contrato]);

  const selectStyle = {
    borderRadius: "12px",
    fontSize: isSmallMobile ? "0.875rem" : "1rem",
    transition: "all 0.2s ease",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
      "&.Mui-focused": {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateClausulas = async () => {
    setLoading(true);
    try {
      const upd = await ContratosService.createClausulasByArtificialInteligence(
        {
          _id: contrato._id,
          clausulaSigilo: clausulaSigilo,
          servicosPrestados: servicosPrestados,
          obrigacaoContrato: obrigacaoContrato,
        }
      );

      console.log(upd);

      // 🔴 Ajuste aqui conforme o retorno da sua API
      // Exemplo: se vier em upd.data.clausulasIa, troque a linha abaixo
      setClausulasIaTexto(upd?.clausulasIa || upd?.data?.clausulasIa || "");

      showToast("Contrato por IA gerado com sucesso!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!contrato.clausulasIa && (
        <>
          <Tooltip title={"Gerar Cláusulas por IA"}>
            <IconButton
              onClick={handleOpen}
              color="success"
              sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.success.main, 0.2),
                },
                width: 56,
                height: 56,
              }}
            >
              <AssistantOutlined />
            </IconButton>
          </Tooltip>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Gerar Cláusulas com IA</DialogTitle>
            <DialogContent dividers>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 3,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                      <TextField
                        label="Quais serviços serão prestados?"
                        fullWidth
                        size="small"
                        disabled={!!contrato.servicosPrestados}
                        value={servicosPrestados}
                        onChange={(e) => {
                          setServicosPrestados(e.target.value);
                        }}
                        sx={selectStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Alguma obrigação no contrato?"
                        fullWidth
                        size="small"
                        disabled={!!contrato.obrigacaoContrato}
                        value={obrigacaoContrato}
                        onChange={(e) => {
                          setObrigacaoContrato(e.target.value);
                        }}
                        sx={selectStyle}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        disabled={!!contrato.clausulaSigilo}
                        control={
                          <Checkbox
                            checked={clausulaSigilo}
                            onChange={(e) => {
                              setClausulaSigilo(e.target.checked);
                            }}
                            color="primary"
                            size="small"
                            sx={{ borderRadius: "10px" }}
                          />
                        }
                        label="Adicionar Cláusula de Sigilo no Contrato?"
                      />
                    </Grid>
                  </Grid>

                  {/* ⬇️ Área onde as cláusulas geradas aparecem dentro do Dialog */}
                  {clausulasIaTexto && (
                    <Box mt={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Cláusulas geradas pela IA
                      </Typography>
                      <TextField
                        multiline
                        minRows={6}
                        fullWidth
                        value={clausulasIaTexto}
                        onChange={(e) => setClausulasIaTexto(e.target.value)}
                      />
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={handleClose}
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                disabled={loading || contrato.clausulasIa}
                color="success"
                endIcon={
                  loading ? <CircularProgress size={"25px"} /> : undefined
                }
                onClick={handleUpdateClausulas}
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Gerar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ModalPromptGeradorClausulas;
