import { Add, Close } from "@mui/icons-material";
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
import { FornecedorService } from "../../../../../../stores/contrato/serviceFornecedores";
import { useEffect, useState } from "react";
import { useMask } from "@react-input/mask";
import FindAddressByCep from "../../../../../../components/FindAddressByCep";

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

function PhoneField({ value, onChange }: any) {
  const inputRef = useMask({
    mask: "(__) _____-____",
    replacement: { _: /\d/ },
  });

  return (
    <TextField
      inputRef={inputRef}
      label="Telefone"
      value={value || ""}
      onChange={onChange}
      fullWidth
      size="small"
      InputProps={{ style: { borderRadius: "10px" } }}
    />
  );
}

interface FornecedorData {
  nome: string;
  cnpj: string;
  vip: boolean;
  telefone: string;
  nomeContato: string;
  cidade: string;
  uf: string;
  bairro: string;
  rua: string;
  email: string;
  cep: string;
  numero: string;
  sala: string;
  complemento: string;
}

const ModalCriarFornecedores = ({ showToast, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FornecedorData>({
    nome: "",
    cnpj: "",
    vip: false,
    telefone: "",
    nomeContato: "",
    cidade: "",
    uf: "",
    bairro: "",
    rua: "",
    email: "",
    cep: "",
    numero: "",
    sala: "",
    complemento: "",
  });

  const [errors, setErrors] = useState({
    nome: false,
    cnpj: false,
  });

  const [cepAddress, setCepAddress] = useState("");
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      nome: "",
      cnpj: "",
      vip: false,
      telefone: "",
      nomeContato: "",
      cidade: "",
      uf: "",
      bairro: "",
      rua: "",
      email: "",
      cep: "",
      numero: "",
      sala: "",
      complemento: "",
    });
    setErrors({ nome: false, cnpj: false });
  };

  const handleChange =
    (field: keyof FornecedorData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "vip" ? event.target.checked : event.target.value;
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }));

      // Limpar erro quando o usuário começar a digitar nos campos obrigatórios
      if ((field === "nome" || field === "cnpj") && value) {
        setErrors((prev) => ({
          ...prev,
          [field]: false,
        }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors = {
      nome: !formData.nome.trim(),
      cnpj: !formData.cnpj.trim(),
    };

    setErrors(newErrors);
    return !newErrors.nome && !newErrors.cnpj;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        console.log("Dados do cliente:", formData);

        await FornecedorService.create(formData);
        handleClose();
        showToast("Sucesso ao criar Cliente!", "success");
        setFlushHook((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Cliente!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar Fornecedores">
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
            Cadastrar Novo Fornecedor
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Nome (Obrigatório) */}
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Nome"
                  fullWidth
                  required
                  value={formData.nome}
                  onChange={handleChange("nome")}
                  error={errors.nome}
                  helperText={errors.nome ? "Nome é obrigatório" : ""}
                  placeholder="Digite o nome da empresa"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* CNPJ (Obrigatório) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CNPJField
                  value={formData.cnpj}
                  onChange={handleChange("cnpj")}
                  error={errors.cnpj}
                />
              </Grid>

              {/* VIP */}
              <Grid size={{ xs: 12 }}>
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
                  label="Fornecedor VIP"
                />
              </Grid>

              {/* Telefone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <PhoneField
                  value={formData.telefone}
                  onChange={handleChange("telefone")}
                />
              </Grid>

              {/* Nome do Contato */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nome do Contato"
                  fullWidth
                  value={formData.nomeContato}
                  onChange={handleChange("nomeContato")}
                  placeholder="Nome da pessoa de contato"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="email@empresa.com"
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

              {/* Sala */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Sala"
                  fullWidth
                  value={formData.sala}
                  onChange={handleChange("sala")}
                  placeholder="Número da Sala"
                  size="small"
                  InputProps={{ style: { borderRadius: "10px" } }}
                />
              </Grid>

              {/* Complemento */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Complemento"
                  fullWidth
                  value={formData.complemento}
                  onChange={handleChange("complemento")}
                  placeholder="Complementação"
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
            Cadastrar Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarFornecedores;
