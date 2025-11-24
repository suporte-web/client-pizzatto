import { AssistantOutlined } from "@mui/icons-material";
import {
  alpha,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { ContratosService } from "../../../../stores/contrato/serviceContratos";

const ModalPromptGeradorClausulas = ({ contrato }: any) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sigilo, setSigilo] = useState(false);
  const [servicosPrestados, setServicosPrestados] = useState("");
  const [obrigacaoContrato, setObrigacaoContrato] = useState("");

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
      const upd = await ContratosService.update({ _id: contrato._id });
      console.log(upd);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Gerar Cláusulas com IA</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <TextField
                label="Quais serviços serão prestados?"
                fullWidth
                size="small"
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
                value={obrigacaoContrato}
                onChange={(e) => {
                  setObrigacaoContrato(e.target.value);
                }}
                sx={selectStyle}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sigilo}
                    onChange={(e) => {
                      setSigilo(e.target.checked);
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
            disabled={loading}
            color="success"
            endIcon={loading ? <CircularProgress /> : ""}
            onClick={handleUpdateClausulas}
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            Gerar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalPromptGeradorClausulas;
