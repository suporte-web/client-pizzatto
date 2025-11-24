// Código ajustado para a model solicitada
// Modelo final: filial, cnpj, ativo, vip, representanteLegal, cidade, uf, bairro, rua, numero, complemento

import { useEffect, useState } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useMask } from "@react-input/mask";
import FindAddressByCep from "../../../../../../components/FindAddressByCep";
import { FilialService } from "../../../../../../stores/contrato/serviceFilial";

function CNPJField({ value, onChange, error }: any) {
  const inputRef = useMask({
    mask: "__.___.___/____-__",
    replacement: { _: /\d/ },
  });
  return (
    <TextField
      inputRef={inputRef}
      label="CNPJ"
      value={value || ""}
      onChange={onChange}
      fullWidth
      required
      error={error}
      helperText={error ? "CNPJ é obrigatório" : ""}
      size="small"
      InputProps={{ style: { borderRadius: "10px" } }}
    />
  );
}

function ModalCriarFiliais({ showToast, setFlushHook }: any) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    filial: "",
    cnpj: "",
    ativo: true,
    vip: false,
    representanteLegal: "",
    cidade: "",
    uf: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    complemento: "",
  });

  const [cepAddress, setCepAddress] = useState("");
  const [infoCep, setInfoCep] = useState<any>({});

  const [errors, setErrors] = useState({ filial: false, cnpj: false });

  useEffect(() => {
    if (infoCep && infoCep.cep) {
      setFormData((prev) => ({
        ...prev,
        cep: infoCep.cep || "",
        cidade: infoCep.city || "",
        uf: infoCep.state || "",
        bairro: infoCep.neighborhood || "",
        rua: infoCep.street || "",
      }));
    }
  }, [infoCep]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      filial: "",
      cnpj: "",
      ativo: true,
      vip: false,
      representanteLegal: "",
      cidade: "",
      uf: "",
      bairro: "",
      rua: "",
      numero: "",
      cep: '',
      complemento: "",
    });
    setCepAddress("");
    setErrors({ filial: false, cnpj: false });
  };

  const handleChange = (field: any) => (event: any) => {
    const value =
      field === "vip" || field === "ativo"
        ? event.target.checked
        : event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if ((field === "filial" || field === "cnpj") && value) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      filial: !formData.filial.trim(),
      cnpj: !formData.cnpj.trim(),
    };
    setErrors(newErrors);
    return !newErrors.filial && !newErrors.cnpj;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      await FilialService.create(formData);
      handleClose();
      showToast("Sucesso ao criar Filial!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      console.error(error);
      showToast("Erro ao criar Filial!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar Filial">
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
            Cadastrar Nova Filial
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Nome da Filial"
                  fullWidth
                  required
                  value={formData.filial}
                  onChange={handleChange("filial")}
                  error={errors.filial}
                  helperText={errors.filial ? "Nome é obrigatório" : ""}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CNPJField
                  value={formData.cnpj}
                  onChange={handleChange("cnpj")}
                  error={errors.cnpj}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.vip}
                      onChange={handleChange("vip")}
                      size="small"
                    />
                  }
                  label="Filial VIP"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Representante Legal"
                  fullWidth
                  value={formData.representanteLegal}
                  onChange={handleChange("representanteLegal")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FindAddressByCep
                  cepAddress={cepAddress}
                  setCepAddress={setCepAddress}
                  setInfoCep={setInfoCep}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Cidade"
                  fullWidth
                  value={formData.cidade}
                  onChange={handleChange("cidade")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  label="UF"
                  fullWidth
                  inputProps={{ maxLength: 2 }}
                  value={formData.uf}
                  onChange={handleChange("uf")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Bairro"
                  fullWidth
                  value={formData.bairro}
                  onChange={handleChange("bairro")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  label="Rua"
                  fullWidth
                  value={formData.rua}
                  onChange={handleChange("rua")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  label="Número"
                  fullWidth
                  value={formData.numero}
                  onChange={handleChange("numero")}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  label="Complemento"
                  fullWidth
                  value={formData.complemento}
                  onChange={handleChange("complemento")}
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
            Cadastrar Filial
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ModalCriarFiliais;
