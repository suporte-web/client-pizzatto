import { useEffect, useState } from "react";
import { useToast } from "../../../components/Toast";
import { BibliotecaMarcaService } from "../../../stores/bibliotecaMarca/service";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Close, Image } from "@mui/icons-material";
import { orange } from "@mui/material/colors";

type PreviewImage = {
  file: File;
  preview: string;
};

type Props = {
  setFlushHook: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalCreateBibliotecaMarca = ({ setFlushHook }: Props) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
  });

  const [imagens, setImagens] = useState<PreviewImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpen = () => setOpen(true);

  const resetForm = () => {
    imagens.forEach((img) => URL.revokeObjectURL(img.preview));

    setForm({
      nome: "",
      descricao: "",
    });
    setImagens([]);
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (field: "nome" | "descricao", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const arquivos = Array.from(files);

    const imagensValidas = arquivos.filter((file) =>
      file.type.startsWith("image/"),
    );

    const novasImagens: PreviewImage[] = imagensValidas.map((file) => ({
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

    if (!form.nome.trim()) newErrors.nome = "Informe o nome";
    if (!form.descricao.trim()) {
      newErrors.descricao = "Informe a descrição";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("descricao", form.descricao);
      imagens.forEach((img) => formData.append("arquivo", img.file));

      await BibliotecaMarcaService.create(formData);

      showToast("Biblioteca de Marca criada com sucesso", "success");
      setFlushHook((prev) => !prev);
      handleClose();
    } catch (error) {
      console.error(error);
      showToast("Erro ao criar a Biblioteca de Marca", "error");
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
      <Tooltip title="Criar Biblioteca de Marca">
        <IconButton onClick={handleOpen} sx={{ bgcolor: orange[200] }}>
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Criar Biblioteca de Marca</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              fullWidth
              error={!!errors.nome}
              helperText={errors.nome}
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

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<Image />}
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

export default ModalCreateBibliotecaMarca;
