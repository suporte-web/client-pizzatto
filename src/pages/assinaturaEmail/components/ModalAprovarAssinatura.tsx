import { Check, Close, VerifiedOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useState } from "react";
import { AssinaturaEmailService } from "../../../stores/assinaturaEmail/service";

const ModalAprovarAssinatura = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleAprovarAssinatura = async () => {
    try {
      setLoading(true);

      await AssinaturaEmailService.updateValidacao({
        id: item.id,
        nome: item.nome,
        email: item.email,
        status: "APROVADO",
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
      <Tooltip title="Aprovar assinatura">
        <IconButton
          onClick={handleOpen}
          sx={{
            bgcolor: green[100],
            color: green[800],
            border: "1px solid",
            borderColor: green[200],
            transition: "0.2s",
            "&:hover": {
              bgcolor: green[200],
              transform: "scale(1.05)",
            },
          }}
        >
          <Check />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
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
            <VerifiedOutlined sx={{ color: green[600], fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              Aprovar assinatura
            </Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Você está prestes a aprovar a assinatura do colaborador:
          </Typography>

          <Box
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              p: 2,
              border: "1px solid #e0e0e0",
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

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Após a aprovação, a assinatura será liberada para uso e o colaborador
            será notificado por e-mail.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            disabled={loading}
            startIcon={<Close />}
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
            color="success"
            onClick={handleAprovarAssinatura}
            disabled={loading}
            startIcon={<Check />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              boxShadow: "none",
            }}
          >
            {loading ? "Aprovando..." : "Aprovar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalAprovarAssinatura;