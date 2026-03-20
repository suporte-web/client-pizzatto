import { Add, Close, Image as ImageIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { MuralService } from "../../../../stores/mural/service";
import { useToast } from "../../../../components/Toast";

const filiaisDisponiveis = [
  { label: "Todos", value: "todos" },
  { label: "Paraná - Campina Grande", value: "Campina Grande" },
  { label: "Paraná - CEP Portão", value: "CEP Portão" },
  { label: "Paraná - Costeira", value: "Costeira" },
  { label: "Paraná - COP Boticario", value: "COP Boticario" },
  { label: "Paraná - Matriz", value: "Matriz" },
  { label: "São Paulo - Araraquara", value: "Araraquara" },
  { label: "São Paulo - Guarulhos", value: "Guarulhos" },
  { label: "Bahia - Camaçari", value: "Camaçari" },
  { label: "Bahia - Feira de Santana", value: "Feira de Santana" },
  { label: "Bahia - São Gonçalo", value: "São Gonçalo" },
  { label: "Minas Gerais - Varginha", value: "Varginha" },
];

const ModalCreateMural = ({ setFlushHook }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFiliais, setSelectedFiliais] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [valideUntil, setValideUntil] = useState("");
  const [important, setImportant] = useState(false);

  const filiaisReais = useMemo(
    () =>
      filiaisDisponiveis
        .filter((filial) => filial.value !== "todos")
        .map((filial) => filial.value),
    [],
  );

  const allSelected =
    filiaisReais.length > 0 &&
    filiaisReais.every((filial) => selectedFiliais.includes(filial));

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOpen = () => {
    setOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSelectedFiliais([]);
    setImageFile(null);
    setValideUntil("");
    setImportant(false);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
  };

  const handleChangeFiliais = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const values = typeof value === "string" ? value.split(",") : value;

    if (values.includes("todos")) {
      setSelectedFiliais(allSelected ? [] : filiaisReais);
      return;
    }

    setSelectedFiliais(values.filter((v) => v !== "todos"));
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();

      formData.append("titulo", title);
      formData.append("mensagem", message);
      formData.append("validoAte", valideUntil);
      formData.append("importante", String(important));

      selectedFiliais.forEach((filial) => {
        formData.append("filiais", filial);
      });

      if (imageFile) {
        formData.append("imagem", imageFile);
      }

      await MuralService.create(formData);
      showToast("Sucesso ao Criar Mural", "success");
      handleClose();
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      console.log(error);
      showToast("Erro ao Criar Mural", "error");
    }
  };

  return (
    <>
      <Tooltip title="Adicionar Mural">
        <Button
          variant="contained"
          fullWidth
          onClick={handleOpen}
          sx={{ bgcolor: "#FF4D00", color: "white", borderRadius: "10px" }}
        >
          <Add /> Adicionar Mural
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>Adicionar Mural</DialogTitle>
        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filiais-label">Filiais</InputLabel>
                <Select
                  labelId="filiais-label"
                  multiple
                  value={selectedFiliais}
                  onChange={handleChangeFiliais}
                  input={<OutlinedInput label="Filiais" />}
                  renderValue={() =>
                    allSelected
                      ? "Todas as filiais"
                      : selectedFiliais.join(", ")
                  }
                >
                  {filiaisDisponiveis.map((filial) => {
                    const isTodos = filial.value === "todos";
                    const checked = isTodos
                      ? allSelected
                      : selectedFiliais.includes(filial.value);

                    return (
                      <MenuItem key={filial.value} value={filial.value}>
                        <Checkbox checked={checked} size="small" />
                        <ListItemText primary={filial.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                type="datetime-local"
                label="Valido Até"
                fullWidth
                value={valideUntil}
                onChange={(e) => setValideUntil(e.target.value)}
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={important}
                      onChange={(e) => setImportant(e.target.checked)}
                    />
                  }
                  label="Importante"
                />
              </FormGroup>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                label="Título do mural"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                label="Mensagem"
                fullWidth
                multiline
                minRows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Box>
                <Typography variant="subtitle1" mb={1}>
                  Imagem do mural
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{ borderRadius: "10px" }}
                >
                  Selecionar imagem
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Box>
                <Typography variant="h6" mb={2}>
                  Preview do mural
                </Typography>

                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  {previewUrl && (
                    <CardMedia
                      component="img"
                      image={previewUrl}
                      alt="Imagem do mural"
                      sx={{
                        width: "100%",
                        maxHeight: 320,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {title || "Título do mural"}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "pre-wrap",
                            color: "#444",
                          }}
                        >
                          {message || "A mensagem do mural aparecerá aqui."}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" mb={1}>
                          Filiais selecionadas
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                        >
                          {selectedFiliais.length > 0 ? (
                            allSelected ? (
                              <Chip
                                label="Todas as filiais"
                                color="primary"
                                variant="outlined"
                                sx={{ borderRadius: "8px" }}
                              />
                            ) : (
                              selectedFiliais.map((filial) => (
                                <Chip
                                  key={filial}
                                  label={filial}
                                  color="primary"
                                  variant="outlined"
                                  sx={{ borderRadius: "8px" }}
                                />
                              ))
                            )
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Nenhuma filial selecionada.
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: "10px" }}
            startIcon={<Close />}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreate}
            sx={{ borderRadius: "10px" }}
            disabled={!title || !message || selectedFiliais.length === 0}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateMural;
