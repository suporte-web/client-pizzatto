import { useState } from "react";
import { Add, Close } from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { FaseService } from "../../../../../../stores/contrato/serviceFases";

interface FaseData {
  fase: string;
}

const ModalCriarFases = ({ showToast, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FaseData>({
    fase: "",
  });

  const [errors, setErrors] = useState({
    fase: false,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      fase: "",
    });
    setErrors({ fase: false });
  };

  const handleChange =
    (field: keyof FaseData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      console.log("Novo valor:", value);
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Limpar erro quando o usuário começar a digitar
      if (field === "fase") {
        setErrors((prev) => ({
          ...prev,
          [field]: false,
        }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors = {
      fase: !formData.fase.trim(),
    };

    setErrors(newErrors);
    return !newErrors.fase;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        console.log("Dados da fase:", formData);

        // Supondo que o método de criação seja adequado para esse tipo de dado
        await FaseService.create(formData);
        handleClose();
        showToast("Fase criada com sucesso!", "success");
        setFlushHook((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Fase!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar Fase">
        <IconButton onClick={handleOpen}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Cadastrar Nova Fase
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Fase (Obrigatório) */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Fase"
                  fullWidth
                  required
                  value={formData.fase}
                  onChange={handleChange("fase")}
                  error={errors.fase}
                  helperText={errors.fase ? "Fase é obrigatória" : ""}
                  placeholder="Digite o nome da fase"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ borderRadius: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ borderRadius: "10px" }}
          >
            Cadastrar Fase
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarFases;
