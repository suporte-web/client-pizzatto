import { Add, Close, Image as ImageIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
  Stack,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { PaginaInstitucionalService } from "../../../stores/paginaInstitucional/service";
import { useToast } from "../../../components/Toast";

type PreviewImage = {
  file: File;
  preview: string;
};

const ModalCreatePaginaInstitucional = ({ setFlushHook }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
  });

  const [imagens, setImagens] = useState<PreviewImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpen = () => setOpen(true);

  const resetForm = () => {
    imagens.forEach((img) => URL.revokeObjectURL(img.preview));

    setForm({
      titulo: "",
      descricao: "",
    });
    setImagens([]);
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const arquivos = Array.from(files);

    const imagensValidas = arquivos.filter((file) =>
      file.type.startsWith("image/"),
    );

    const novasImagens = imagensValidas.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagens((prev) => [...prev, ...novasImagens]);

    if (arquivos.length !== imagensValidas.length) {
      setErrors((prev) => ({
        ...prev,
        imagens:
          "Alguns arquivos foram ignorados por não serem imagens válidas.",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.imagens;
        return newErrors;
      });
    }

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImagens((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.titulo.trim()) newErrors.titulo = "Informe o título";
    if (!form.descricao.trim()) newErrors.descricao = "Informe a descrição";

    setErrors((prev) => ({
      ...prev,
      titulo: newErrors.titulo || "",
      descricao: newErrors.descricao || "",
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Exemplo para integração futura com API
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);
      imagens.forEach((img) => formData.append("imagens", img.file));

      await PaginaInstitucionalService.create(formData);

      showToast("Criado a Página Institucional", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error(error);
      showToast("Erro ao criar a Página Institucional", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagens.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [imagens]);

  return (
    <>
      <Tooltip title="Criar Página Institucional">
        <IconButton onClick={handleOpen} sx={{ bgcolor: orange[200] }}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Criar Página Institucional</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Título"
              value={form.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              fullWidth
              error={!!errors.titulo}
              helperText={errors.titulo}
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />

            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              fullWidth
              multiline
              minRows={3}
              error={!!errors.descricao}
              helperText={errors.descricao}
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />

            {/* <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="Ativa">Ativa</MenuItem>
              <MenuItem value="Inativa">Inativa</MenuItem>
            </TextField> */}

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
                sx={{ borderRadius: "10px" }}
              >
                Adicionar imagens
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                />
              </Button>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {imagens.length === 0
                  ? "Nenhuma imagem selecionada."
                  : `${imagens.length} imagem(ns) selecionada(s).`}
              </Typography>

              {errors.imagens && (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  mt={0.5}
                >
                  {errors.imagens}
                </Typography>
              )}
            </Box>

            {imagens.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "1fr 1fr 1fr",
                    md: "1fr 1fr 1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                {imagens.map((img, index) => (
                  <Paper
                    key={`${img.file.name}-${index}`}
                    elevation={3}
                    sx={{
                      p: 1,
                      borderRadius: "12px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        bgcolor: "rgba(255,255,255,0.85)",
                        zIndex: 1,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,1)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>

                    <Box
                      component="img"
                      src={img.preview}
                      alt={img.file.name}
                      sx={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                        borderRadius: "8px",
                        display: "block",
                      }}
                    />

                    <Typography
                      variant="caption"
                      display="block"
                      mt={1}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={img.file.name}
                    >
                      {img.file.name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: "10px" }}
            disabled={loading}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ borderRadius: "10px" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreatePaginaInstitucional;
