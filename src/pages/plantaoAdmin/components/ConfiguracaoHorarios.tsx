import { AccessTime } from "@mui/icons-material";
import {
  Alert,
  alpha,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PlantaoService } from "../../../stores/plantao/service";
import { useToast } from "../../../components/Toast";

type JanelaHorario = {
  inicio: string;
  fim: string;
};

const ConfiguracaoHorarios = () => {
  const theme = useTheme();
  const { showToast } = useToast();

  const [janelaSistemas, setJanelaSistemas] = useState<JanelaHorario>({
    inicio: "08:00",
    fim: "18:00",
  });

  const [janelaInfra, setJanelaInfra] = useState<JanelaHorario>({
    inicio: "08:00",
    fim: "18:00",
  });

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getAllEscalasAndHorarios();

      console.log(get);
      
      setJanelaSistemas({
        inicio: get?.janelaSisInicio ?? "08:00",
        fim: get?.janelaSisFim ?? "18:00",
      });

      setJanelaInfra({
        inicio: get?.janelaInfInicio ?? "08:00",
        fim: get?.janelaInfFim ?? "18:00",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateHorarios = async () => {
    try {
      await PlantaoService.updateHorarios({
        janelaInfra,
        janelaSistemas,
      });
      showToast("Sucesso ao configurar horários", "success");
    } catch (error) {
      console.log(error);
      showToast("Erro ao configurar horários", "error");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        mb: 4,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <AccessTime sx={{ color: "warning.main" }} />
          Configuração de Horários
        </Typography>

        <Button
          variant="contained"
          onClick={handleUpdateHorarios}
          sx={{ borderRadius: "10px" }}
        >
          Atualizar
        </Button>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.light, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.primary.light, 0.3),
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              Horário Sistemas
            </Typography>

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Início
                </Typography>
                <TextField
                  type="time"
                  value={janelaSistemas.inicio}
                  onChange={(e) =>
                    setJanelaSistemas((prev) => ({
                      ...prev,
                      inicio: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Fim
                </Typography>
                <TextField
                  type="time"
                  value={janelaSistemas.fim}
                  onChange={(e) =>
                    setJanelaSistemas((prev) => ({
                      ...prev,
                      fim: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.success.light, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.success.light, 0.3),
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              Horário Infraestrutura
            </Typography>

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Início
                </Typography>
                <TextField
                  type="time"
                  value={janelaInfra.inicio}
                  onChange={(e) =>
                    setJanelaInfra((prev) => ({
                      ...prev,
                      inicio: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Fim
                </Typography>
                <TextField
                  type="time"
                  value={janelaInfra.fim}
                  onChange={(e) =>
                    setJanelaInfra((prev) => ({
                      ...prev,
                      fim: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3, fontSize: "0.75rem" }}>
        * Nota: Nos finais de semana (Sábado e Domingo), o sistema ignora estes
        horários e mantém o plantão ATIVO o dia todo.
      </Alert>
    </Paper>
  );
};

export default ConfiguracaoHorarios;