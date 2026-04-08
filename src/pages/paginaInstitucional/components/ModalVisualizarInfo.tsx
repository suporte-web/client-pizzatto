import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

const ModalVisualizarInfo = ({ pagina }: any) => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const imagens = useMemo(() => pagina.caminhoImagem || [], [pagina.caminhoImagem]);

  const handleOpen = () => {
    setOpen(true);
    setCurrentImage(0);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImage(0);
  };

  const handleNextImage = () => {
    if (!imagens.length) return;
    setCurrentImage((prev) => (prev + 1) % imagens.length);
  };

  const handlePrevImage = () => {
    if (!imagens.length) return;
    setCurrentImage((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  useEffect(() => {
    if (!open || imagens.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imagens.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [open, imagens.length]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        size="small"
        sx={{ borderRadius: "10px", textTransform: "none" }}
      >
        Visualizar
      </Button>

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
              {pagina.titulo}
            </Typography>

            <Chip
              label={pagina.status === true ? "ATIVO" : "INATIVO"}
              color={pagina.status === true ? "success" : "error"}
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {imagens.length > 0 ? (
            <Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 260, sm: 380, md: 500 },
                  backgroundColor: "#000",
                  overflow: "hidden",
                }}
              >
                {imagens.map((img: string, index: number) => (
                  <Box
                    key={index}
                    component="img"
                    src={`${import.meta.env.VITE_API_BACKEND}${img}`}
                    alt={`${pagina.titulo}-${index}`}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: currentImage === index ? 1 : 0,
                      transition: "opacity 0.8s ease-in-out",
                    }}
                  />
                ))}

                {imagens.length > 1 && (
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
                      {imagens.map((_: string, index: number) => (
                        <Box
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            cursor: "pointer",
                            backgroundColor:
                              currentImage === index
                                ? "#fff"
                                : "rgba(255,255,255,0.45)",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "text.primary",
                    whiteSpace: "pre-line",
                  }}
                >
                  {pagina.descricao}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2 }}
                >
                  Imagem {imagens.length > 0 ? currentImage + 1 : 0} de {imagens.length}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: "text.primary",
                  whiteSpace: "pre-line",
                }}
              >
                {pagina.descricao}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalVisualizarInfo;