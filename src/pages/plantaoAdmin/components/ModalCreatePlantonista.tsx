import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Add } from "@mui/icons-material";
import { orange } from "@mui/material/colors";
import * as XLSX from "xlsx";

import { PlantaoService } from "../../../stores/plantao/service";
import { useToast } from "../../../components/Toast";

type ManualFormData = {
  plantonistaId: string;
  dataJanela: string;
  janelaInicio: string;
  janelaFim: string;
};

const ModalCreatePlantonista = ({ setFlushHook }: any) => {
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [manualForm, setManualForm] = useState<ManualFormData>({
    plantonistaId: "",
    dataJanela: "",
    janelaInicio: "",
    janelaFim: "",
  });

  const [contatos, setContatos] = useState<any[]>([]);
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    setTab(0);
    setManualForm({
      plantonistaId: "",
      dataJanela: "",
      janelaInicio: "",
      janelaFim: "",
    });
    setSpreadsheetFile(null);
    setProgress(0);
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeManualField =
    (field: keyof ManualFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setManualForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectSpreadsheet = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setSpreadsheetFile(file);
  };

  const handleClickSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitManual = async () => {
    try {
      setLoading(true);

      const payload = {
        plantonistaId: manualForm.plantonistaId.trim(),
        dataJanela: manualForm.dataJanela.trim(),
        janelaInicio: manualForm.janelaInicio.trim(),
        janelaFim: manualForm.janelaFim.trim(),
      };

      await PlantaoService.create(payload);

      showToast("Sucesso ao cadastrar plantonista manualmente", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar plantonista manualmente:", error);
      showToast("Erro ao cadastrar plantonista manualmente", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSpreadsheet = async () => {
    try {
      if (!spreadsheetFile) {
        showToast("Selecione um arquivo", "error");
        return;
      }

      setLoading(true);
      setProgress(10);

      const data = await spreadsheetFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const result = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      }) as Record<string, any>[];

      if (!result.length) {
        showToast("A planilha está vazia", "error");
        return;
      }

      setProgress(40);

      const cleanedData = result.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]),
        ),
      );

      setProgress(70);

      await PlantaoService.createBySpreadsheet(cleanedData);

      setProgress(100);
      showToast("Sucesso ao cadastrar plantonistas por planilha", "success");
      handleClose();
    } catch (error) {
      console.error("Erro ao importar planilha:", error);
      showToast("Erro ao cadastrar plantonistas por planilha", "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (tab === 0) {
      await handleSubmitManual();
      return;
    }

    await handleSubmitSpreadsheet();
  };

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getAllPlantonistas();
      setContatos(get || []);
    } catch (error) {
      console.log(error);
      showToast("Erro ao carregar membros da equipe", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const plantonistaSelecionado =
    contatos.find((contato) => contato.id === manualForm.plantonistaId) || null;

  return (
    <>
      <Tooltip title="Criar dia do Plantonista">
        <IconButton onClick={handleOpen} sx={{ bgcolor: orange[200] }}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Criar Plantonista</DialogTitle>

        <DialogContent dividers>
          <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 3 }}>
            <Tab label="Manual" />
            <Tab label="Planilha" />
          </Tabs>

          {tab === 0 && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Autocomplete
                options={contatos}
                value={plantonistaSelecionado}
                onChange={(_, newValue) => {
                  setManualForm((prev) => ({
                    ...prev,
                    plantonistaId: newValue?.id || "",
                  }));
                }}
                getOptionLabel={(option) =>
                  option?.nome ? `${option.nome} - ${option.area}` : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plantonista"
                    size="small"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      style: { borderRadius: "10px" },
                    }}
                  />
                )}
              />

              <TextField
                type="date"
                size="small"
                label="Data Janela"
                value={manualForm.dataJanela}
                onChange={handleChangeManualField("dataJanela")}
                fullWidth
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { borderRadius: "10px" } }}
              />

              <TextField
                type="time"
                size="small"
                label="Janela Inicio"
                value={manualForm.janelaInicio}
                onChange={handleChangeManualField("janelaInicio")}
                fullWidth
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { borderRadius: "10px" } }}
              />

              <TextField
                type="time"
                size="small"
                label="Janela Fim"
                value={manualForm.janelaFim}
                onChange={handleChangeManualField("janelaFim")}
                fullWidth
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Box>
          )}

          {tab === 1 && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2">
                Faça upload de uma planilha para cadastrar vários plantonistas.
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleSelectSpreadsheet}
              />

              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleClickSelectFile}
                disabled={loading}
              >
                Selecionar arquivo
              </Button>

              {spreadsheetFile && (
                <Typography variant="body2">
                  Arquivo selecionado: <strong>{spreadsheetFile.name}</strong>
                </Typography>
              )}
            </Box>
          )}

          {loading && tab === 1 && (
            <Box mt={3}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Processando planilha... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading ||
              (tab === 0
                ? !manualForm.plantonistaId ||
                  !manualForm.dataJanela ||
                  !manualForm.janelaInicio ||
                  !manualForm.janelaFim
                : !spreadsheetFile)
            }
          >
            {loading ? "Processando..." : tab === 0 ? "Salvar" : "Importar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreatePlantonista;
