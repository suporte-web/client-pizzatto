import { Add, UploadFile } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  type SelectChangeEvent,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../../components/Toast";
import { PoliticasService } from "../../../stores/politicas/service";
import { UserAdService } from "../../../stores/adLdap/serviceUsersAd";

const ModalCreatePolitica = ({ setFlushHook, departamentos }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    departamento: "",
    tipoPolitica: "",
    responsavel: "",
    arquivo: null as File | null,
  });
  const [usersAtivos, setUsersAtivos] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      nome: "",
      descricao: "",
      departamento: "",
      tipoPolitica: "",
      responsavel: "",
      arquivo: null,
    });
  };

  const handleChangeDepartamentos = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      departamento: event.target.value,
    });
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      arquivo: file,
    }));
  };

  const handleCreate = async () => {
    try {
      const payload = new FormData();
      payload.append("nome", formData.nome);
      payload.append("descricao", formData.descricao);
      payload.append("departamento", formData.departamento);
      payload.append("tipoPolitica", formData.tipoPolitica);

      if (formData.arquivo) {
        payload.append("arquivo", formData.arquivo);
      }

      await PoliticasService.create(payload);

      showToast("Sucesso ao criar Politica", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Politica", "error");
    }
  };

  const fetchData = async () => {
    try {
      const get = await UserAdService.getAllActiveUsers();

      setUsersAtivos(get);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Tooltip title="Criar">
        <IconButton onClick={handleOpen} sx={{ bgcolor: orange[200] }}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            pb: 1,
          }}
        >
          📄 Nova Política
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              mb: 1,
            }}
          >
            <TextField
              type="text"
              label="Nome da Política"
              size="small"
              fullWidth
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                },
              }}
            />

            <TextField
              type="text"
              label="Tipo da Política"
              size="small"
              fullWidth
              value={formData.tipoPolitica}
              onChange={(e) =>
                setFormData({ ...formData, tipoPolitica: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                },
              }}
            />

            <Autocomplete
              options={usersAtivos || []}
              getOptionLabel={(option: any) =>
                option.displayName || option.cn || option.sAMAccountName || ""
              }
              onChange={(_, value: any) =>
                setFormData({
                  ...formData,
                  responsavel: value?.sAMAccountName || "",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Responsável pela Política"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
              )}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="filiais-label">
                Departamento Controlador da Política
              </InputLabel>

              <Select
                labelId="filiais-label"
                value={formData.departamento}
                onChange={handleChangeDepartamentos}
                input={
                  <OutlinedInput label="Departamento Controlador da Política" />
                }
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                }}
              >
                {departamentos.map((depart: any) => (
                  <MenuItem key={depart} value={depart}>
                    {depart}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="text"
              multiline
              rows={3}
              label="Descrição da Política"
              size="small"
              fullWidth
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                },
              }}
              InputLabelProps={{ shrink: true }}
            />

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleSelectFile}
            />

            <Box
              onClick={handleOpenFilePicker}
              sx={{
                border: "2px dashed #d1d5db",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: "#fafafa",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              <UploadFile sx={{ fontSize: 32, color: "#1976d2" }} />

              <Box sx={{ mt: 1, fontSize: "14px", fontWeight: 500 }}>
                {formData.arquivo
                  ? formData.arquivo.name
                  : "Clique para adicionar um arquivo"}
              </Box>

              <Box sx={{ fontSize: "12px", color: "#666" }}>
                PDF, DOC ou DOCX
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              fontWeight: 600,
              boxShadow: "none",
              background: "linear-gradient(135deg, #4caf50, #2e7d32)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            Salvar Política
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreatePolitica;
