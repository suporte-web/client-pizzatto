import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useMask } from "@react-input/mask";
import { useEffect, useState } from "react";
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

interface FilialData {
  filial: string;
  cnpj: string;
  ativo: boolean;
  vip: boolean;
  representanteLegal: string;
  nomeContato: string;
  cidade: string;
  uf: string;
  rua: string;
  bairro: string;
  email: string;
  cep: string;
  numero: string;
  complemento: string;
}

const ModalEditarFiliais = ({ showToast, setFlushHook, item }: any) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FilialData>({
    filial: item.filial,
    cnpj: item.cnpj,
    ativo: item.ativo,
    vip: item.vip,
    representanteLegal: item.representanteLegal,
    nomeContato: item.nomeContato,
    cidade: item.cidade,
    uf: item.uf,
    bairro: item.bairro,
    rua: item.rua,
    email: item.email,
    cep: item.cep,
    numero: item.numero,
    complemento: item.complemento,
  });

  const [errors, setErrors] = useState({
    nome: false,
    cnpj: false,
  });

  const [cepAddress, setCepAddress] = useState(item.cep);
  const [infoCep, setInfoCep] = useState<any>({});

  useEffect(() => {
    if (infoCep && infoCep.cep) {
      setFormData((prev) => ({
        ...prev,
        cep: infoCep.cep,
        cidade: infoCep.city || "",
        uf: infoCep.state || "",
        bairro: infoCep.neighborhood || "",
        rua: infoCep.street || "",
      }));
    }
  }, [infoCep]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({ nome: false, cnpj: false });
  };

  const handleChange =
    (field: keyof FilialData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "vip" ? event.target.checked : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpar erro quando o usuário começar a digitar nos campos obrigatórios
      if ((field === "filial" || field === "cnpj") && value) {
        setErrors((prev) => ({
          ...prev,
          [field]: false,
        }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors = {
      nome: !formData.filial.trim(),
      cnpj: !formData.cnpj.trim(),
    };

    setErrors(newErrors);
    return !newErrors.nome && !newErrors.cnpj;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        console.log("Dados da Filial:", formData);

        await FilialService.update({ ...formData, _id: item._id });
        handleClose();
        showToast("Sucesso ao editar Filial!", "success");
        setFlushHook((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao editar Filial!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Editar Filial">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Filial</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Nome (Obrigatório) */}
              <Grid size={{ xs: 12, sm: 7 }}>
                <TextField
                  label="Nome"
                  fullWidth
                  required
                  value={formData.filial}
                  onChange={handleChange("filial")}
                  error={errors.nome}
                  helperText={errors.nome ? "Nome é obrigatório" : ""}
                  placeholder="Digite o nome da empresa"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* CNPJ (Obrigatório) */}
              <Grid size={{ xs: 12, sm: 5 }}>
                <CNPJField
                  value={formData.cnpj}
                  onChange={handleChange("cnpj")}
                  error={errors.cnpj}
                />
              </Grid>

              {/* VIP */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.vip}
                      onChange={handleChange("vip")}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: "10px" }}
                    />
                  }
                  label="Filial VIP"
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
                  label="Filial Ativo"
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

              {/* CEP */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FindAddressByCep
                  cepAddress={cepAddress}
                  setCepAddress={setCepAddress}
                  setInfoCep={setInfoCep}
                />
              </Grid>

              {/* Cidade */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Cidade"
                  fullWidth
                  value={formData.cidade}
                  onChange={handleChange("cidade")}
                  placeholder="Nome da cidade"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* UF */}
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  label="UF"
                  fullWidth
                  value={formData.uf}
                  onChange={handleChange("uf")}
                  placeholder="UF"
                  inputProps={{ maxLength: 2 }}
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* Bairro */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Bairro"
                  fullWidth
                  value={formData.bairro}
                  onChange={handleChange("bairro")}
                  placeholder="Nome do bairro"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* Rua */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Rua"
                  fullWidth
                  value={formData.rua}
                  onChange={handleChange("rua")}
                  placeholder="Nome da Rua"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* Número */}
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  label="Número"
                  fullWidth
                  value={formData.numero}
                  onChange={handleChange("numero")}
                  placeholder="Número da Rua"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
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
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarFiliais;
