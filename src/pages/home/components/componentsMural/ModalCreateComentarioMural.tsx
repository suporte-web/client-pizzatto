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
  fetchComentarios,
  comentarios,
  loadingComentarios,
}: any) => {
  const [open, setOpen] = useState(false);
  const [comentario, setComentario] = useState("");
  // const [comentarios, setComentarios] = useState<any[]>([]);
  // const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [sending, setSending] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    await fetchComentarios(muralId);
  };

  const handleClose = () => {
    setOpen(false);
    setComentario("");
  };

  // const fetchComentarios = async () => {
  //   try {
  //     setLoadingComentarios(true);

  //     const response = await MuralComentarioService.findByMural({
  //       muralId,
  //     });

  //     setComentarios(Array.isArray(response) ? response : []);
  //   } catch (error) {
  //     console.log(error);
  //     setComentarios([]);
  //   } finally {
  //     setLoadingComentarios(false);
  //   }
  // };

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
      await fetchComentarios();
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
      <Tooltip title="Comentários">
        <IconButton onClick={handleOpen}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Comentários do mural
            </Typography>
          </Box>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "60vh",
            p: 0,
          }}
        >
          {/* LISTA DE COMENTÁRIOS */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            <Typography variant="body2" fontWeight={700} sx={{ mb: 2 }}>
              Pessoas que comentaram ({comentarios.length})
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

          {/* ÁREA DE INPUT */}
          <Box sx={{ p: 1.5 }}>
            {/* EMOJIS */}
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

            {/* INPUT + BOTÃO */}
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
