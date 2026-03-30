import { AssignmentTurnedInOutlined, PersonOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PoliticasAceitesService } from "../../../stores/politicasAceites/service";

const ModalVisualizarAceites = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const [aceites, setAceites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("pt-BR");
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const get = await PoliticasAceitesService.findAceitesByIdPoliticas({
        id: item.id,
      });

      setAceites(get || []);
    } catch (error) {
      console.log(error);
      setAceites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        color="info"
        size="medium"
        startIcon={<AssignmentTurnedInOutlined />}
        onClick={handleOpen}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          py: 1.1,
          boxShadow: "0 6px 14px rgba(37, 99, 235, 0.25)",
        }}
      >
        Visualizar aceites
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#0f172a",
            pb: 0.5,
          }}
        >
          Aceites da política
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
              >
                {item?.nome}
              </Typography>

              <Typography variant="body2" sx={{ color: "#475569" }}>
                Aqui é possível verificar quem aceitou esta política.
              </Typography>
            </Box>

            {loading ? (
              <Box
                sx={{
                  minHeight: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={28} />
              </Box>
            ) : aceites.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px dashed #cbd5e1",
                  bgcolor: "#f8fafc",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#334155" }}>
                  Nenhum aceite encontrado
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                  Ainda não há colaboradores com aceite registrado para esta
                  política.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {aceites.map((aceite: any, index: number) => (
                  <Card
                    key={aceite.id || `${aceite.colaborador}-${index}`}
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1.2 }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#eff6ff",
                            color: "#2563eb",
                            flexShrink: 0,
                          }}
                        >
                          <PersonOutline fontSize="small" />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: "#0f172a",
                              wordBreak: "break-word",
                            }}
                          >
                            {aceite.colaborador || "Colaborador não informado"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Aceite registrado
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 1.2 }} />

                      <Typography variant="body2" sx={{ color: "#475569" }}>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          Data do aceite:
                        </Box>{" "}
                        {formatDate(aceite.dataAceite)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalVisualizarAceites;
