import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { MuralComentarioService } from "../../../../stores/muralComentario/service";

const emojisRapidos = ["👍", "👏", "🎉", "❤️", "🔥", "😊", "🚀", "🙌"];

const ModalCreateComentarioMural = ({
  muralId,
  mural,
  fetchComentarios,
  comentarios,
  loadingComentarios,
  setModalAberto,
}: any) => {
  const [open, setOpen] = useState(false);
  const [comentario, setComentario] = useState("");
  const [sending, setSending] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setModalAberto(true); // 🔥 avisa o pai
    await fetchComentarios(muralId);
  };

  const handleClose = () => {
    setOpen(false);
    setModalAberto(false); // 🔥 libera o refresh
    setComentario("");
  };

  const handleAddEmoji = (emoji: string) => {
    setComentario((prev) => `${prev}${emoji}`);
  };

  const handleCreateComentario = async () => {
    if (!comentario.trim()) return;

    try {
      setSending(true);

      await MuralComentarioService.create({
        muralId,
        comentario: comentario.trim(),
      });

      setComentario("");
      await fetchComentarios(muralId);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "";

    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <>
      <Tooltip title="Abrir mural e comentários">
        <IconButton onClick={handleOpen}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Mural de Recados
          </Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh",
            p: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            {mural?.caminhoImagem && (
              <Box
                sx={{
                  width: "100%",
                  maxHeight: 420,
                  borderRadius: "14px",
                  overflow: "hidden",
                  backgroundColor: "#f5f5f5",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_API_BACKEND_AD}/${mural.caminhoImagem}`}
                  alt={mural?.titulo || "Imagem do mural"}
                  sx={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
            )}

            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
              {mural?.titulo}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                color: "#444",
                lineHeight: 1.7,
              }}
            >
              {mural?.mensagem}
            </Typography>

            {mural?.departamentoCriador && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1.5 }}
              >
                Criado por: {mural.departamentoCriador}
              </Typography>
            )}
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              minHeight: 220,
            }}
          >
            <Typography variant="body2" fontWeight={700} sx={{ mb: 2 }}>
              Comentários ({comentarios.length})
            </Typography>

            {loadingComentarios ? (
              <Typography variant="body2" color="text.secondary">
                Carregando comentários...
              </Typography>
            ) : comentarios.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Ainda não há comentários neste mural.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {comentarios.map((item: any) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Box display="flex" gap={1.5}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {item?.nome?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {item.nome}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {formatarData(item.createdAt)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.comentario}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Divider />

          <Box sx={{ p: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 1,
                overflowX: "auto",
              }}
            >
              {emojisRapidos.map((emoji) => (
                <Button
                  key={emoji}
                  variant="text"
                  size="small"
                  onClick={() => handleAddEmoji(emoji)}
                  sx={{
                    minWidth: 36,
                    fontSize: "18px",
                    borderRadius: "8px",
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </Box>

            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Digite seu comentário..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  pr: 0.5,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enviar">
                      <IconButton
                        onClick={handleCreateComentario}
                        disabled={!comentario.trim() || sending}
                        sx={{
                          bgcolor: "primary.main",
                          color: "#fff",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                          width: 36,
                          height: 36,
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCreateComentarioMural;
