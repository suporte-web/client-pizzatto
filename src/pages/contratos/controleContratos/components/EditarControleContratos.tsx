import {
  alpha,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ClienteService } from "../../../../stores/contrato/serviceClientes";
import { FornecedorService } from "../../../../stores/contrato/serviceFornecedores";
import { FilialService } from "../../../../stores/contrato/serviceFilial";
import { Save, Cancel } from "@mui/icons-material";
import { ContratosService } from "../../../../stores/contrato/serviceContratos";
import { UserService } from "../../../../stores/users/service";

const EditarControleContratos = ({
  contrato,
  showToast,
  setEditarContrato,
  setFlushHook,
}: any) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filiais, setFiliais] = useState<any[]>([]);
  const [filial, setFilial] = useState(contrato?.filial?._id || "");

  const [clientesFornecedores, setClientesFornecedores] = useState<any[]>([]);
  const [cliente, setCliente] = useState(
    contrato?.cliente ? contrato.cliente._id : ""
  );
  const [fornecedor, setFornecedor] = useState(
    contrato?.fornecedor ? contrato.fornecedor._id : ""
  );
  const [numeroContrato, setNumeroContrato] = useState(
    contrato?.contrato || ""
  );
  const [contas, setContas] = useState(contrato?.contas || "");
  const [status, setStatus] = useState(contrato?.status || "");
  const [dataInicioFidelidade, setDataInicioFidelidade] = useState(
    contrato?.dataInicioFidelidade || ""
  );
  const [dataFinalFidelidade, setDataFinalFidelidade] = useState(
    contrato?.dataFinalFidelidade || ""
  );
  const [valorRestante, setValorRestante] = useState(
    contrato?.valorRestante || ""
  );
  const [valor, setValor] = useState(contrato?.valor || "");
  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [responsavel, setResponsavel] = useState(contrato?.responsavel || "");
  const [indiceReajuste, setIndiceReajuste] = useState(
    contrato?.indiceReajuste || ""
  );
  const [risco, setRisco] = useState(contrato?.risco || "");
  const [dataAssinatura, setDataAssinatura] = useState(contrato?.dataAssinatura || "");

  const fetchResponsavel = async () => {
    try {
      const get = await UserService.findAll();
      const findOnlyContratos = get.filter(
        (user: any) => user?.acessos?.contratos
      );
      setResponsaveis(findOnlyContratos);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Responsáveis!", "error");
    }
  };

  const fetchClientesFornecedores = async () => {
    try {
      if (contrato?.cliente) {
        const res = await ClienteService.findAtivos();
        setClientesFornecedores(res);
      } else {
        const res = await FornecedorService.findAtivos();
        setClientesFornecedores(res);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Clientes/Fornecedores!", "error");
    }
  };

  const fetchFiliais = async () => {
    try {
      const res = await FilialService.findAtivos();
      setFiliais(res);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Filiais!", "error");
    }
  };

  const cardStyle = {
    borderRadius: "16px",
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: "all 0.3s ease-in-out",
    height: "100%",
    "&:hover": {
      boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
      transform: "translateY(-2px)",
    },
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.1
    )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    padding: "20px 24px",
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
      "&.Mui-focused": {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem",
    },
  };

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

  const formatarDadosParaEnvio = () => ({
    _id: contrato._id,
    cliente: cliente || undefined,
    fornecedor: fornecedor || undefined,
    filial: filial || undefined,
    contrato: numeroContrato,
    contas,
    status,
    dataInicioFidelidade,
    dataFinalFidelidade,
    valorRestante,
    valor,
    responsavel,
    indiceReajuste,
    risco,
    dataAssinatura
  });

  const handleUpdateInfoContratos = async () => {
    try {
      const dados = formatarDadosParaEnvio();
      await ContratosService.update(dados);

      showToast("Sucesso ao Atualizar Informações!", "success");
      setFlushHook((prev: any) => !prev);
      setEditarContrato(false);
    } catch (error) {
      console.log(error);
      showToast("Erro ao Atualizar Informações!", "error");
    }
  };

  const handleCancel = () => {
    setEditarContrato(false);
  };

  useEffect(() => {
    setNumeroContrato(contrato?.contrato || "");
    setContas(contrato?.contas || "");
    setStatus(contrato?.status || "");
    setDataInicioFidelidade(contrato?.dataInicioFidelidade || "");
    setDataFinalFidelidade(contrato?.dataFinalFidelidade || "");
    setValorRestante(contrato?.valorRestante || "");
    setValor(contrato?.valor || "");
    setResponsavel(contrato?.responsavel || "");
    setIndiceReajuste(contrato?.indiceReajuste || "");
    setRisco(contrato?.risco || "");
    setDataAssinatura(contrato?.dataAssinatura || "");

    fetchClientesFornecedores();
    fetchFiliais();
    fetchResponsavel();
  }, [contrato]);

  return (
    <>
      {/* Header com ações */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.warning.main, 0.05),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Editando Contrato
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modo de edição - Modifique os campos necessários
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Cancelar Edição">
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancelar
            </Button>
          </Tooltip>

          <Tooltip title="Salvar Alterações">
            <Button
              variant="contained"
              color="success"
              startIcon={<Save />}
              onClick={handleUpdateInfoContratos}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.3)",
                "&:hover": {
                  boxShadow: "0px 6px 16px rgba(76, 175, 80, 0.4)",
                },
              }}
            >
              Salvar
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Card Informações do Contrato */}
        <Grid
          component={Paper}
          elevation={0}
          size={{ xs: 12, md: 4 }}
          sx={cardStyle}
        >
          <Box sx={headerStyle}>
            <Typography
              align="center"
              variant="h6"
              fontWeight={600}
              sx={{ letterSpacing: 0.5 }}
            >
              Informações do Contrato
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Número do Contrato"
                  fullWidth
                  size="small"
                  value={numeroContrato}
                  onChange={(e) => setNumeroContrato(e.target.value)}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Contas"
                  fullWidth
                  size="small"
                  value={contas}
                  onChange={(e) => setContas(e.target.value)}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    Status
                  </InputLabel>
                  <Select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {[
                      "INICIADO",
                      "EM NEGOCIACAO",
                      "AGUARDANDO ASSINATURA",
                      "ATIVO",
                      "CANCELADO",
                      "EXPIRADO",
                    ].map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                        sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="date"
                  label="Data Inicio Fidelidade"
                  fullWidth
                  size="small"
                  value={dataInicioFidelidade}
                  onChange={(e) => setDataInicioFidelidade(e.target.value)}
                  sx={textFieldStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="date"
                  label="Data Final Fidelidade"
                  fullWidth
                  size="small"
                  value={dataFinalFidelidade}
                  onChange={(e) => setDataFinalFidelidade(e.target.value)}
                  sx={textFieldStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Valor Restante"
                  fullWidth
                  size="small"
                  value={valorRestante}
                  onChange={(e) => setValorRestante(e.target.value)}
                  type="number"
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Valor Total"
                  fullWidth
                  size="small"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  type="number"
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    Responsável
                  </InputLabel>
                  <Select
                    label="Responsável"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {responsaveis.map((option) => (
                      <MenuItem
                        key={option}
                        value={option.nome}
                        sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                      >
                        {option.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Índice de Reajuste"
                  fullWidth
                  size="small"
                  value={indiceReajuste}
                  onChange={(e) => setIndiceReajuste(e.target.value)}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    Risco
                  </InputLabel>
                  <Select
                    label="Risco"
                    value={risco}
                    onChange={(e) => setRisco(e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {["ALTO", "MÉDIO OU MODERADO", "BAIXO", "INEXISTENTE"].map(
                      (option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                        >
                          {option}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  type="date"
                  label="Data Assinatura"
                  fullWidth
                  size="small"
                  value={dataAssinatura}
                  onChange={(e) => setDataAssinatura(e.target.value)}
                  sx={textFieldStyle}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>

        {/* Parte Contratado */}
        <Grid
          component={Paper}
          elevation={0}
          size={{ xs: 12, md: 4 }}
          sx={cardStyle}
        >
          <Box sx={headerStyle}>
            <Typography align="center" variant="h6" fontWeight={600}>
              Parte Contratada
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>
                  {contrato.cliente ? "Cliente" : "Fornecedor"}
                </InputLabel>
                <Select
                  label={contrato.cliente ? "Cliente" : "Fornecedor"}
                  value={contrato.cliente ? cliente : fornecedor}
                  sx={selectStyle}
                  onChange={(e) =>
                    contrato.cliente
                      ? setCliente(e.target.value)
                      : setFornecedor(e.target.value)
                  }
                >
                  {clientesFornecedores.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {option.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.cpf || option.cnpj}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Selecione o {contrato.cliente ? "cliente" : "fornecedor"} para
                  este contrato
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Grid>

        {/* Filial */}
        <Grid
          component={Paper}
          elevation={0}
          size={{ xs: 12, md: 4 }}
          sx={cardStyle}
        >
          <Box sx={headerStyle}>
            <Typography align="center" variant="h6" fontWeight={600}>
              Filial
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Filial</InputLabel>
                <Select
                  label="Filial"
                  value={filial}
                  onChange={(e) => setFilial(e.target.value)}
                  sx={selectStyle}
                >
                  {filiais.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {option.filial}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.cnpj} • {option.cidade}/{option.uf}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Selecione a filial responsável pelo contrato
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Grid>
      </Grid>
    </>
  );
};

export default EditarControleContratos;
