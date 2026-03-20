import { Close, HighlightOffOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { AssinaturaEmailService } from "../../../stores/assinaturaEmail/service";

const ModalReprovarAssinatura = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setMotivo("");
    }
  };

  const handleReprovarAssinatura = async () => {
    try {
      if (!motivo.trim()) return;

      setLoading(true);

      await AssinaturaEmailService.updateValidacao({
        id: item.id,
        nome: item.nome,
        email: item.email,
        status: "REPROVADO",
        motivo: motivo.trim(),
      });

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Reprovar assinatura">
        <IconButton
          onClick={handleOpen}
          sx={{
            bgcolor: red[100],
            color: red[800],
            border: "1px solid",
            borderColor: red[200],
            transition: "0.2s",
            "&:hover": {
              bgcolor: red[200],
              transform: "scale(1.05)",
            },
          }}
        >
          <Close />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <HighlightOffOutlined sx={{ color: red[600], fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              Reprovar assinatura
            </Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Você está prestes a reprovar a assinatura do colaborador:
          </Typography>

          <Box
            sx={{
              bgcolor: "#fdf4f4",
              borderRadius: 2,
              p: 2,
              border: "1px solid #f0d4d4",
              mb: 2.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {item.nome}
            </Typography>

            {item.email && (
              <Typography variant="body2" color="text.secondary">
                {item.email}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Motivo da reprovação"
            placeholder="Descreva o motivo da reprovação para que o colaborador possa corrigir a assinatura..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Esse motivo será enviado ao colaborador por e-mail.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleReprovarAssinatura}
            disabled={loading || !motivo.trim()}
            startIcon={<Close />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              boxShadow: "none",
            }}
          >
            {loading ? "Reprovando..." : "Reprovar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalReprovarAssinatura;
