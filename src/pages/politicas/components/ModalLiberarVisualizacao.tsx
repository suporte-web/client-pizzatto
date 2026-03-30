import {
  VisibilityOffOutlined,
  VisibilityOutlined,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useToast } from "../../../components/Toast";
import { PoliticasService } from "../../../stores/politicas/service";

const ModalLiberarVisualizacao = ({ item, setFlushHook }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const isLiberado = item.liberadoVisualizacao === true;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeLiberadoVisualizacao = async () => {
    try {
      await PoliticasService.update({
        id: item.id,
        liberadoVisualizacao: !item.liberadoVisualizacao,
      });
      setFlushHook((prev: any) => !prev);
      showToast("Sucesso ao alterar visualização", "success");
      handleClose();
    } catch (error) {
      console.log(error);
      showToast("Erro ao alterar visualização", "error");
    }
  };

  return (
    <>
      {/* BOTÃO */}
      <Button
        fullWidth
        variant={isLiberado ? "outlined" : "contained"}
        color={isLiberado ? "error" : "primary"}
        size="medium"
        startIcon={
          isLiberado ? <VisibilityOffOutlined /> : <VisibilityOutlined />
        }
        onClick={handleOpen}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          py: 1.1,
          boxShadow: isLiberado ? "none" : "0 6px 14px rgba(37, 99, 235, 0.25)",
        }}
      >
        {isLiberado ? "Bloquear visualização" : "Liberar visualização"}
      </Button>

      {/* MODAL */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "18px",
            padding: 1,
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            pb: 0,
          }}
        >
          Alterar visualização
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <WarningAmberRounded sx={{ color: "#f59e0b" }} />

              <Typography variant="body2" sx={{ color: "#334155" }}>
                Você está prestes a{" "}
                <strong>{isLiberado ? "bloquear" : "liberar"}</strong> a
                visualização da política:
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                {item.nome}
              </Typography>

              <Typography variant="body2" sx={{ color: "#64748b" }}>
                ID: {item.id}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleChangeLiberadoVisualizacao}
            color={isLiberado ? "error" : "success"}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
            }}
          >
            {isLiberado ? "Bloquear" : "Liberar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalLiberarVisualizacao;
