import { Event } from "@mui/icons-material";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { PlantaoService } from "../../../stores/plantao/service";
import { useEffect, useState } from "react";
import moment from "moment";

type EscalaSemanaItem = {
  dataJanela: string;
  diaSemana: string;
  nome: string;
  telefone: string;
  area: string;
  janelaInicio: string;
  janelaFim: string;
};

const Escalas = () => {
  const [escalasSemana, setEscalasSemana] = useState<EscalaSemanaItem[]>([]);

  const fetchDataEscalas = async () => {
    try {
      const get = await PlantaoService.getPlantonistasSemanaAtual();

      console.log(get);
      setEscalasSemana(get ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataEscalas();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Event sx={{ color: "warning.main" }} />
          Escalas da Semana
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack spacing={2} mt={2}>
            {escalasSemana.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum plantão encontrado para esta semana.
              </Typography>
            )}
            <Grid container spacing={2}>
              {escalasSemana.map((item, index) => (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    key={`${item.dataJanela}-${item.nome}-${index}`}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.diaSemana} -{" "}
                        {moment(item.dataJanela).format("DD/MM/YYYY")}
                      </Typography>
                      <Chip
                        label={item.area}
                        color={item.area === "Infra" ? "success" : "primary"}
                      />
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "grey.50",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography>
                        <strong>Nome:</strong> {item.nome || "-"}
                      </Typography>
                      <Typography>
                        <strong>Telefone:</strong> {item.telefone || "-"}
                      </Typography>
                      <Typography>
                        <strong>Janela:</strong> {item.janelaInicio || "-"} às{" "}
                        {item.janelaFim || "-"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Escalas;
