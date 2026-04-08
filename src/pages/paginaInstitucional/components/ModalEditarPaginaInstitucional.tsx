import {
  AddPhotoAlternate,
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
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
import { useEffect, useMemo, useState } from "react";
import { PaginaInstitucionalService } from "../../../stores/paginaInstitucional/service";
import { useToast } from "../../../components/Toast";

type PreviewImage = {
  file: File;
  preview: string;
};

const ModalEditarPaginaInstitucional = ({ pagina, setFlushHook }: any) => {
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
  });

  const [imagensAtuais, setImagensAtuais] = useState<string[]>([]);
  const [novasImagens, setNovasImagens] = useState<PreviewImage[]>([]);
  const [imagemAtualIndex, setImagemAtualIndex] = useState(0);

  const imagensCarousel = useMemo(() => {
    const antigas = imagensAtuais.map((img) => ({
      tipo: "antiga" as const,
      src: `${import.meta.env.VITE_API_BACKEND}${img}`,
    }));

    const novas = novasImagens.map((img) => ({
      tipo: "nova" as const,
      src: img.preview,
    }));

    return [...antigas, ...novas];
  }, [imagensAtuais, novasImagens]);

  const handleOpen = () => {
    setForm({
      titulo: pagina?.titulo || "",
      descricao: pagina?.descricao || "",
    });
    setImagensAtuais(pagina?.caminhoImagem || []);
    setNovasImagens([]);
    setImagemAtualIndex(0);
    setOpen(true);
  };

  const handleClose = () => {
    novasImagens.forEach((img) => URL.revokeObjectURL(img.preview));
    setOpen(false);
    setNovasImagens([]);
    setImagemAtualIndex(0);
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

    const novas = imagensValidas.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNovasImagens((prev) => [...prev, ...novas]);

    event.target.value = "";
  };

  const handleRemoveImagemAtual = (index: number) => {
    setImagensAtuais((prev) => {
      const novoArray = prev.filter((_, i) => i !== index);

      setImagemAtualIndex((current) => {
        if (novoArray.length === 0) return 0;
        if (current >= novoArray.length + novasImagens.length) return 0;
        return Math.min(current, novoArray.length + novasImagens.length - 1);
      });

      return novoArray;
    });
  };

  const handleRemoveNovaImagem = (index: number) => {
    setNovasImagens((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const novoArray = prev.filter((_, i) => i !== index);

      setImagemAtualIndex((current) => {
        const total = imagensAtuais.length + novoArray.length;
        if (total === 0) return 0;
        return Math.min(current, total - 1);
      });

      return novoArray;
    });
  };

  const handlePrevImage = () => {
    if (!imagensCarousel.length) return;
    setImagemAtualIndex((prev) =>
      prev === 0 ? imagensCarousel.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    if (!imagensCarousel.length) return;
    setImagemAtualIndex((prev) => (prev + 1) % imagensCarousel.length);
  };

  useEffect(() => {
    if (!open || imagensCarousel.length <= 1) return;

    const interval = setInterval(() => {
      setImagemAtualIndex((prev) => (prev + 1) % imagensCarousel.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [open, imagensCarousel.length]);

  useEffect(() => {
    return () => {
      novasImagens.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [novasImagens]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", pagina.id);
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);

      imagensAtuais.forEach((img) => {
        formData.append("imagensAtuais", img);
      });

      novasImagens.forEach((img) => {
        formData.append("novasImagens", img.file);
      });

      await PaginaInstitucionalService.update(formData);

      showToast("Página Institucional atualizada com sucesso", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error(error);
      showToast("Erro ao atualizar a Página Institucional", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Editar Página Institucional">
        <Button
          onClick={handleOpen}
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          sx={{ borderRadius: "10px", textTransform: "none" }}
        >
          Editar
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "18px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Editar Página Institucional
            </Typography>

            <Chip
              label={pagina?.status === true ? "ATIVO" : "INATIVO"}
              color={pagina?.status === true ? "success" : "error"}
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 240, sm: 360, md: 480 },
              backgroundColor: "#111",
              overflow: "hidden",
            }}
          >
            {imagensCarousel.length > 0 ? (
              <>
                {imagensCarousel.map((img, index) => (
                  <Box
                    key={`${img.tipo}-${index}`}
                    component="img"
                    src={img.src}
                    alt={`${pagina?.titulo}-${index}`}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: imagemAtualIndex === index ? 1 : 0,
                      transition: "opacity 0.8s ease-in-out",
                    }}
                  />
                ))}

                {imagensCarousel.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 16,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.65)",
                        },
                      }}
                    >
                      <ArrowBackIos />
                    </IconButton>

                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 16,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.65)",
                        },
                      }}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 1,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: "999px",
                    bgcolor: "rgba(0,0,0,0.35)",
                  }}
                >
                  {imagensCarousel.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setImagemAtualIndex(index)}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        cursor: "pointer",
                        backgroundColor:
                          imagemAtualIndex === index
                            ? "#fff"
                            : "rgba(255,255,255,0.45)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Typography>Nenhuma imagem cadastrada</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                fullWidth
              />

              <TextField
                label="Descrição"
                value={form.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                fullWidth
                multiline
                minRows={5}
              />

              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternate />}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Adicionar novas imagens
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                  />
                </Button>
              </Box>

              {imagensAtuais.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Imagens atuais
                  </Typography>

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
                    {imagensAtuais.map((img, index) => (
                      <Paper
                        key={`${img}-${index}`}
                        elevation={2}
                        sx={{
                          p: 1,
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImagemAtual(index)}
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
                          src={`${import.meta.env.VITE_API_BACKEND}${img}`}
                          alt={`imagem-atual-${index}`}
                          sx={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}

              {novasImagens.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Novas imagens
                  </Typography>

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
                    {novasImagens.map((img, index) => (
                      <Paper
                        key={`${img.file.name}-${index}`}
                        elevation={2}
                        sx={{
                          p: 1,
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveNovaImagem(index)}
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
                          alt={`nova-imagem-${index}`}
                          sx={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: "10px", textTransform: "none" }}
            disabled={loading}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ borderRadius: "10px", textTransform: "none" }}
            disabled={loading}
          >
            Salvar alterações
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarPaginaInstitucional;
