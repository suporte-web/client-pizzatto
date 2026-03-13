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
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

const filiaisDisponiveis = [
  {
    label: "Paraná - Campina Grande",
    value: "Campina Grande",
  },
  {
    label: "Paraná - CEP Portão",
    value: "CEP Portão",
  },
  {
    label: "Paraná - Costeira",
    value: "Costeira",
  },
  {
    label: "Paraná - COP Boticario",
    value: "COP Boticario",
  },
  {
    label: "Paraná - Matriz",
    value: "Matriz",
  },
  {
    label: "São Paulo - Araraquara",
    value: "Araraquara",
  },
  {
    label: "São Paulo - Guarulhos",
    value: "Guarulhos",
  },
  {
    label: "Bahia - Camaçari",
    value: "Camaçari",
  },
  {
    label: "Bahia - Feira de Santana",
    value: "Feira de Santana",
  },
  {
    label: "Bahia - São Gonçalo",
    value: "São Gonçalo",
  },
  {
    label: "Minas Gerais - Varginha",
    value: "Varginha",
  },
];

const ModalCreateMural = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFiliais, setSelectedFiliais] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    setSelectedFiliais(typeof value === "string" ? value.split(",") : value);
  };

  const handleCreate = () => {
    const muralData = {
      title,
      message,
      filiais: selectedFiliais,
      imageFile,
    };

    console.log("Mural criado:", muralData);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ borderRadius: "10px" }}
      >
        <Add sx={{ mr: 1 }} />
        Adicionar Mural
      </Button>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>Adicionar Mural</DialogTitle>
        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filiais-label">Filiais</InputLabel>
              <Select
                labelId="filiais-label"
                multiple
                value={selectedFiliais}
                onChange={handleChangeFiliais}
                input={<OutlinedInput label="Filiais" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {filiaisDisponiveis.map((filial) => (
                  <MenuItem key={filial.value} value={filial.value}>
                    <Checkbox checked={selectedFiliais.includes(filial.value)} />
                    <ListItemText primary={filial.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Título do mural"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />

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

            <Divider />

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
                          selectedFiliais.map((filial) => (
                            <Chip
                              key={filial}
                              label={filial}
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: "8px" }}
                            />
                          ))
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
          </Stack>
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
