import { Add } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { ContaOfficeService } from "../../../stores/contasOffice/service";
import * as XLSX from "xlsx";

const ModalCriarContasOffice = ({ setFlushHook, showToast }: any) => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  // estados para o modo manual
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // estado para o modo planilha
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [gruposEnviados, setGruposEnviados] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // se quiser limpar campos ao fechar:
    setNome("");
    setEmail("");
    setSenha("");
    setFile(null);
    setTabValue(0);
    setOpen(false);
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleCreate = async () => {
    try {
      await ContaOfficeService.create({
        nome,
        email,
        senha,
      });
      setFlushHook((prev: any) => !prev);
      showToast("Sucesso ao Criar Conta!", "success");
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const processSpreadsheet = async (result: any[]) => {
    setTotalGrupos(result.length);
    setGruposEnviados(0);
    setProgress(0);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < result.length; i++) {
      try {
        // Limpa dados vazios e remove espaços extras
        const cleanedData = Object.fromEntries(
          Object.entries(result[i]).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ])
        );

        console.log("Enviando dados da linha:", cleanedData); // Para debug

        await ContaOfficeService.createBySpreadsheet(cleanedData);
        successCount++;
      } catch (error: any) {
        console.error(`Erro ao processar a linha ${i + 1}:`, error);
        errorCount++;
        errors.push(`Linha ${i + 1}: ${error.message || "Erro desconhecido"}`);
      } finally {
        setGruposEnviados((prev: number) => prev + 1);
        setProgress(Math.round(((i + 1) / result.length) * 100));
      }
    }

    return { successCount, errorCount, errors };
  };

  const handleUploadPlanilha = async () => {
    if (!file) {
      showToast("Selecione um arquivo", "error");
      return;
    }

    setUploadLoading(true);
    setProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Configuração para melhor parsing
      const result = XLSX.utils.sheet_to_json(worksheet, {
        raw: false, // Converte números e datas para string
        defval: "", // Valor padrão para células vazias
      });

      console.log("Dados processados da planilha:", result);

      if (result.length === 0) {
        showToast("A planilha está vazia", "error");
        return;
      }

      const { successCount, errorCount, errors } = await processSpreadsheet(
        result
      );

      if (errorCount === 0) {
        showToast(`${successCount} itens criados com sucesso!`, "success");
        handleClose();
      } else if (successCount > 0) {
        showToast(
          `${successCount} itens criados, ${errorCount} erros. Verifique o console.`,
          "warning"
        );
        // Mostra erros detalhados no console
        console.error("Erros detalhados:", errors);
      } else {
        showToast(
          `Falha ao criar itens. ${
            errors.length > 0 ? errors[0] : "Verifique o formato do arquivo."
          }`,
          "error"
        );
      }
      setFlushHook((prev: any) => !prev);
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error);
      showToast(
        error.message || "Erro ao processar arquivo. Verifique o formato.",
        "error"
      );
    } finally {
      setUploadLoading(false);
      setProgress(0);
      setTotalGrupos(0);
      setGruposEnviados(0);
    }
  };

  return (
    <>
      <Tooltip title="Criar Conta do Office">
        <IconButton
          onClick={handleOpen}
          color={"primary"}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            },
            width: 56,
            height: 56,
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Criar Conta do Office</DialogTitle>

        <DialogContent>
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Manual" />
            <Tab label="Planilha" />
          </Tabs>

          {/* PAINEL: CRIAÇÃO MANUAL */}
          {tabValue === 0 && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
              <TextField
                label="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                fullWidth
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
              {/* Se quiser, pode adicionar mais campos, ex: licença, departamento, etc. */}
            </Box>
          )}

          {/* PAINEL: IMPORTAÇÃO POR PLANILHA */}
          {tabValue === 1 && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Typography variant="body2">
                Envie uma planilha contendo as colunas necessárias (por exemplo:
                <strong> Nome, Email, Licença</strong>).
              </Typography>

              <Button variant="outlined" component="label">
                Selecionar arquivo
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Arquivo selecionado: <strong>{file.name}</strong>
                </Typography>
              )}
            </Box>
          )}

          {uploadLoading && (
            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Processando: {gruposEnviados} de {totalGrupos} itens ({progress}
                %)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Fechar
          </Button>
          {tabValue === 0 && (
            <Button
              onClick={handleCreate}
              variant="contained"
              color="success"
              sx={{ textTransform: "none", borderRadius: "10px" }}
              disabled={tabValue === 0 && (!nome || !email)}
            >
              Adicionar Conta
            </Button>
          )}
          {tabValue === 1 && (
            <Button
              onClick={handleUploadPlanilha}
              variant="contained"
              color="success"
              sx={{ textTransform: "none", borderRadius: "10px" }}
              disabled={tabValue === 1 && !file}
            >
              Adicionar Conta
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarContasOffice;
