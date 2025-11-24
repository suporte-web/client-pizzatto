import { Add, Close, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FaseService } from "../../../../../../stores/contrato/serviceFases";
import { useState } from "react";
import { ValoresContratosService } from "../../../../../../stores/contrato/serviceValoresContratos";

interface ValorContratoData {
  _id: string;
  valorContrato: string;
  fases: string[];
  ativo: boolean;
}

const ModalEditarValoresContrato = ({ item, showToast, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ValorContratoData>({
    _id: item._id,
    valorContrato: item.valorContrato,
    fases: Array.isArray(item.fases) ? item.fases : [item.fases],
    ativo: item.ativo,
  });
  const [fases, setFases] = useState<any[]>([]);

  const [errors, setErrors] = useState({
    valorContrato: false,
  });

  const handleOpen = () => {
    setOpen(true);
    fetchFases();

    setFormData({
      _id: item._id,
      valorContrato: item.valorContrato,
      fases: Array.isArray(item.fases) ? item.fases : [item.fases],
      ativo: item.ativo,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({ valorContrato: false });
  };

  const fetchFases = async () => {
    try {
      const get = await FaseService.findAll();
      setFases(get);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange =
    (field: keyof ValorContratoData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "ativo" ? event.target.checked : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "valorContrato" && value) {
        setErrors((prev) => ({
          ...prev,
          [field]: false,
        }));
      }
    };

  const handleFaseChange = (index: number, value: string) => {
    const novasFases = [...formData.fases];
    novasFases[index] = value;
    setFormData((prev) => ({ ...prev, fases: novasFases }));
  };

  const handleAddFase = () => {
    setFormData((prev) => ({
      ...prev,
      fases: [...prev.fases, ""], // ✅ corrigido
    }));
  };

  const handleRemoveFase = (index: number) => {
    const novasFases = formData.fases.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      fases: novasFases,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      valorContrato: !formData.valorContrato.trim(),
    };
    setErrors(newErrors);
    return !newErrors.valorContrato;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        console.log("Dados do contrato:", formData);

        await ValoresContratosService.update(formData);
        handleClose();
        showToast("Sucesso ao atualizar Valor de Contrato!", "success");
        setFlushHook((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao atualizar Valor de Contrato!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar Valor de Contrato">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Editar Valor de Contrato
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Valor de Contrato */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Valor de Contrato"
                  fullWidth
                  required
                  value={formData.valorContrato}
                  onChange={handleChange("valorContrato")}
                  error={errors.valorContrato}
                  helperText={
                    errors.valorContrato
                      ? "Valor de Contrato é obrigatório"
                      : ""
                  }
                  placeholder="Digite o Valor de Contrato"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.ativo}
                      onChange={handleChange("ativo")}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: "10px" }}
                    />
                  }
                  label="Cliente Ativo"
                />
              </Grid>

              {/* Fases Dinâmicas */}
              <Grid size={{ xs: 12 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <strong>Fases</strong>
                  <Button
                    onClick={handleAddFase}
                    startIcon={<Add />}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "10px" }}
                    disabled={formData.fases.length >= fases.length}
                  >
                    Adicionar Fase
                  </Button>
                </Box>
              </Grid>

              {formData.fases.map((fase, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{`Fase ${index + 1}`}</InputLabel>
                      <Select
                        value={fase}
                        label={`Fase ${index + 1}`}
                        onChange={(e) =>
                          handleFaseChange(index, e.target.value)
                        }
                        sx={{ borderRadius: "10px" }}
                      >
                        {fases.map((f) => (
                          <MenuItem key={f._id} value={f.fase}>
                            {f.fase}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formData.fases.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFase(index)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
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
            sx={{ borderRadius: "10px" }}
          >
            Editar Valor de Contrato
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarValoresContrato;
