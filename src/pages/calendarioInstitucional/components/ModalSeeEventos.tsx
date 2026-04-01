import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

const ModalSeeEventos = ({
  dialogOpen,
  setDialogOpen,
  selectedDate,
  setSelectedDate,
  selectedEvents,
  setSelectedEvents,
}: any) => {
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate("");
    setSelectedEvents([]);
  };

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDate) return "";

    const [year, month, day] = selectedDate.split("-");
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Eventos do dia {selectedDateFormatted}
        </DialogTitle>

        <DialogContent dividers>
          {selectedEvents.length === 0 ? (
            <Typography>Nenhum evento encontrado.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {selectedEvents.map((evento: any) => (
                <Card
                  key={evento.id}
                  variant="outlined"
                  sx={{ borderRadius: "12px" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {evento.nome}
                    </Typography>

                    {evento.horario && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Horário:</strong> {evento.horario}
                      </Typography>
                    )}

                    {evento.local && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>Local:</strong> {evento.local}
                      </Typography>
                    )}

                    {evento.area && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>Área:</strong> {evento.area}
                      </Typography>
                    )}

                    {/* {evento.criadoPor && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>Criado por:</strong> {evento.criadoPor}
                      </Typography>
                    )} */}

                    {evento.descricao && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>Descrição:</strong> {evento.descricao}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{ borderRadius: "10px" }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalSeeEventos;
