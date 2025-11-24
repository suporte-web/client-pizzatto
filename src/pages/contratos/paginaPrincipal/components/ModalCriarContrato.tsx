import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ContratosService } from "../../../../stores/contrato/serviceContratos";
import { ClienteService } from "../../../../stores/contrato/serviceClientes";
import { FornecedorService } from "../../../../stores/contrato/serviceFornecedores";
import { ValoresContratosService } from "../../../../stores/contrato/serviceValoresContratos";
import { FilialService } from "../../../../stores/contrato/serviceFilial";

const ModalCriarContrato = ({ showToast, setFlushHook }: any) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para cadastro de contrato baseado na model
  const [contrato, setContrato] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [clientesFornecedores, setClientesFornecedores] = useState<any[]>([]);
  const [valoresContratos, setValoresContratos] = useState<any[]>([]);
  const [filiais, setFiliais] = useState<any[]>([]);
  const [valorContrato, setValorContrato] = useState("");
  const [cliente, setCliente] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [filial, setFilial] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset dos campos ao fechar
    setContrato("");
    setTipoContrato("");
    setCliente("");
    setFornecedor("");
    setFilial("");
  };

  // Função para formatar dados antes de enviar
  const formatarDadosParaEnvio = () => {
    const dados: any = {
      contrato: contrato || undefined,
      cliente: cliente || undefined,
      fornecedor: fornecedor || undefined,
      valorContrato: valorContrato || undefined,
      filial: filial || undefined,
    };

    return dados;
  };

  const handleCreateContrato = async () => {
    try {
      setLoading(true);

      const dadosFormatados = formatarDadosParaEnvio();

      console.log("Dados sendo enviados:", dadosFormatados); // Para debug

      await ContratosService.create(dadosFormatados);
      showToast("Sucesso ao Criar Contrato!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.log("Erro detalhado:", error);
      showToast("Erro ao Criar Contrato!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se o formulário é válido
  const isFormularioValido = () => {
    return contrato;
  };

  const fetchClientesFornecedores = async () => {
    try {
      if (tipoContrato === "CLIENTE") {
        const getCliente = await ClienteService.findAtivos();
        setClientesFornecedores(getCliente);
      } else {
        const getFornecedor = await FornecedorService.findAtivos();
        setClientesFornecedores(getFornecedor);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Clientes/Fornecedores!", "error");
    }
  };

  const fetchFiliais = async () => {
    try {
      const getFiliais = await FilialService.findAtivos();
      setFiliais(getFiliais);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Filiais!", "error");
    }
  };

  const fetchValoresContrato = async () => {
    try {
      const getValoresContrato = await ValoresContratosService.findAtivos();
      setValoresContratos(getValoresContrato);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Valores-Contratos!", "error");
    }
  };

  useEffect(() => {
    fetchClientesFornecedores();
    fetchValoresContrato();
    fetchFiliais();
  }, [tipoContrato]);

  return (
    <>
      <Tooltip title="Adicionar Contrato">
        <IconButton onClick={handleOpen} color="primary">
          <Add fontSize={isSmallMobile ? "small" : "medium"} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isSmallMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : "12px",
            m: isSmallMobile ? 0 : 2,
            minHeight: isSmallMobile ? "100vh" : "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: isSmallMobile ? "1.25rem" : "1.5rem",
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Criar Contrato
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {/* Número/Identificação do Contrato */}
            <TextField
              size="small"
              label="Contrato"
              fullWidth
              value={contrato}
              onChange={(e) => setContrato(e.target.value)}
              InputProps={{
                style: { borderRadius: "10px" },
                sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
              }}
              required
            />

            <FormControl size="small" fullWidth>
              <InputLabel
                sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
              >
                Tipo de Contrato
              </InputLabel>
              <Select
                label="Tipo de Contrato"
                value={tipoContrato}
                onChange={(e) => setTipoContrato(e.target.value)}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "background.paper",
                  fontSize: isSmallMobile ? "0.875rem" : "1rem",
                }}
              >
                {["CLIENTE", "FORNECEDOR"].map((option) => (
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

            {tipoContrato && (
              <>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    {tipoContrato === "CLIENTE" ? "Cliente" : "Fornecedor"}
                  </InputLabel>
                  <Select
                    label={
                      tipoContrato === "CLIENTE" ? "Cliente" : "Fornecedor"
                    }
                    value={tipoContrato === "CLIENTE" ? cliente : fornecedor}
                    onChange={(e) => {
                      tipoContrato === "CLIENTE"
                        ? setCliente(e.target.value)
                        : setFornecedor(e.target.value);
                    }}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {clientesFornecedores.map((option) => (
                      <MenuItem
                        key={option}
                        value={option._id}
                        sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                      >
                        {option.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    Valores Contratos
                  </InputLabel>
                  <Select
                    label={"Valores Contratos"}
                    value={valorContrato}
                    onChange={(e) => {
                      setValorContrato(e.target.value);
                    }}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {valoresContratos.map((option) => (
                      <MenuItem
                        key={option}
                        value={option._id}
                        sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                      >
                        {option.valorContrato}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                  >
                    Filial
                  </InputLabel>
                  <Select
                    label="Filial"
                    value={filial}
                    onChange={(e) => setFilial(e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      backgroundColor: "background.paper",
                      fontSize: isSmallMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {filiais.map((option) => (
                      <MenuItem
                        key={option}
                        value={option._id}
                        sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                      >
                        {option.filial}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {/* Informação sobre campos obrigatórios */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: isSmallMobile ? "0.7rem" : "0.75rem" }}
            >
              * Campos obrigatórios
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            gap: 1,
            flexDirection: isSmallMobile ? "column" : "row",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              flex: isSmallMobile ? 1 : "none",
              width: isSmallMobile ? "100%" : "auto",
              fontSize: isSmallMobile ? "0.875rem" : "1rem",
              minHeight: isSmallMobile ? "44px" : "auto",
            }}
            disabled={loading}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateContrato}
            sx={{
              borderRadius: "10px",
              flex: isSmallMobile ? 1 : "none",
              width: isSmallMobile ? "100%" : "auto",
              fontSize: isSmallMobile ? "0.875rem" : "1rem",
              minHeight: isSmallMobile ? "44px" : "auto",
            }}
            disabled={loading || !isFormularioValido()}
          >
            {loading ? "Criando..." : "Criar Contrato"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarContrato;
