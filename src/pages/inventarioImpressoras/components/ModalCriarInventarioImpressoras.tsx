import { Add, CloudUpload, Description } from "@mui/icons-material";
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
  Tabs,
  Tab,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import * as XLSX from "xlsx";
import { InventarioImpressorasService } from "../../../stores/inventarioImpressoras/service";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventario-tabpanel-${index}`}
      aria-labelledby={`inventario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const ModalCriarInventarioImpressoras = ({ showToast, setFlushHook }: any) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Estados para cadastro manual
  const [filial, setFilial] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [ip, setIp] = useState("");

  // Estados para upload de planilha
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [gruposEnviados, setGruposEnviados] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset dos campos ao fechar
    setFilial("");
    setModelo("");
    setIp("");
    setNumeroSerie("");
    setFile(null);
    setTabValue(0);
    setProgress(0);
    setTotalGrupos(0);
    setGruposEnviados(0);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Função para formatar dados antes de enviar
  const formatarDadosParaEnvio = () => {
    const dados: any = {
      filial: filial || undefined,
      modelo: modelo || undefined,
      numeroSerie: numeroSerie || undefined,
      ip: ip || undefined,
    };

    return dados;
  };

  const handleCreateInventario = async () => {
    try {
      setLoading(true);

      // Formatar dados antes de enviar
      const dadosFormatados = formatarDadosParaEnvio();

      console.log("Dados sendo enviados:", dadosFormatados); // Para debug

      await InventarioImpressorasService.create(dadosFormatados);
      showToast("Sucesso ao Criar Inventário!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.log("Erro detalhado:", error);
      showToast("Erro ao Criar Inventário!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Verificar se é um arquivo Excel
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (
        !allowedTypes.includes(selectedFile.type) &&
        !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)
      ) {
        showToast("Por favor, selecione um arquivo Excel ou CSV", "error");
        return;
      }

      setFile(selectedFile);
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

        await InventarioImpressorasService.createBySpreadsheet(cleanedData);
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
      <Tooltip title="Adicionar Item ao Inventário">
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
          Criar Inventário
        </DialogTitle>

        <DialogContent>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isSmallMobile ? "fullWidth" : "standard"}
              aria-label="Opções de criação de inventário"
            >
              <Tab
                icon={<Description />}
                iconPosition="start"
                label={isSmallMobile ? "Manual" : "Cadastro Manual"}
                sx={{
                  minHeight: "48px",
                  fontSize: isSmallMobile ? "0.8rem" : "0.875rem",
                }}
              />
              <Tab
                icon={<CloudUpload />}
                iconPosition="start"
                label={isSmallMobile ? "Planilha" : "Por Planilha"}
                sx={{
                  minHeight: "48px",
                  fontSize: isSmallMobile ? "0.8rem" : "0.875rem",
                }}
              />
            </Tabs>
          </Box>

          {/* Tab 1 - Cadastro Manual */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                size="small"
                label="Filial"
                fullWidth
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                InputLabelProps={{
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                required
              />

              <TextField
                size="small"
                label="Modelo"
                fullWidth
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                InputLabelProps={{
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                required
              />

              <TextField
                size="small"
                label="IP"
                fullWidth
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                InputLabelProps={{
                  sx: { fontSize: isSmallMobile ? "0.875rem" : "1rem" },
                }}
                required
              />

              {/* Informação sobre campos obrigatórios */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: isSmallMobile ? "0.7rem" : "0.75rem" }}
              >
                * Campos obrigatórios
              </Typography>
            </Box>
          </TabPanel>

          {/* Tab 2 - Upload por Planilha */}
          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
              }}
            >
              {/* Informações */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontSize: isSmallMobile ? "1rem" : "1.125rem" }}
                >
                  Importar via Planilha
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: isSmallMobile ? "0.8rem" : "0.875rem" }}
                >
                  Faça o upload de uma planilha Excel ou CSV com os dados do
                  inventário
                </Typography>
              </Box>

              {/* Área de Upload */}
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: file ? "success.main" : "grey.300",
                  borderRadius: "12px",
                  p: 3,
                  textAlign: "center",
                  width: "100%",
                  backgroundColor: file ? "success.light" : "grey.50",
                  transition: "all 0.3s ease",
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: "grey.500", mb: 2 }} />

                <Typography
                  variant="body1"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  {file ? file.name : "Arraste e solte o arquivo aqui"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: isSmallMobile ? "0.75rem" : "0.875rem",
                  }}
                >
                  Ou clique para selecionar (XLSX, XLS, CSV)
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  disabled={uploadLoading}
                  sx={{ borderRadius: "8px" }}
                >
                  Selecionar Arquivo
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>

              {/* Progresso do Upload */}
              {uploadLoading && (
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Processando: {gruposEnviados} de {totalGrupos} itens (
                    {progress}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              )}
            </Box>
          </TabPanel>
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
            disabled={loading || uploadLoading}
          >
            Fechar
          </Button>

          {tabValue === 0 ? (
            <Button
              variant="contained"
              onClick={handleCreateInventario}
              sx={{
                borderRadius: "10px",
                flex: isSmallMobile ? 1 : "none",
                width: isSmallMobile ? "100%" : "auto",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
                minHeight: isSmallMobile ? "44px" : "auto",
              }}
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleUploadPlanilha}
              sx={{
                borderRadius: "10px",
                flex: isSmallMobile ? 1 : "none",
                width: isSmallMobile ? "100%" : "auto",
                fontSize: isSmallMobile ? "0.875rem" : "1rem",
                minHeight: isSmallMobile ? "44px" : "auto",
              }}
              disabled={uploadLoading || !file}
            >
              {uploadLoading ? "Importando..." : "Importar Planilha"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarInventarioImpressoras;
