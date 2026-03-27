import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  // Card,
  // CardContent,
  // Chip,
  Container,
  Grid,
  Avatar,
  Paper,
  alpha,
  useTheme,
  // Stack,
  // IconButton,
  // Tooltip,
} from "@mui/material";
import {
  // Phone,
  // AccessTime,
  Computer,
  Storage,
  // CheckCircle,
  // CalendarToday,
  ArrowBack,
  // Phone,
  // PhoneAndroid,
} from "@mui/icons-material";
// import { motion } from "framer-motion";
import bgPlantao from "../../imgs/bg-plantao.jpg";
import LogoPizzatto from "../../imgs/image.png";
import { PlantaoService } from "../../stores/plantao/service";
import PlantaoCard from "./components/PlantaoCard";

const PlantaoPrincipal = () => {
  const theme = useTheme();
  const [agora, setAgora] = useState(new Date());
  const [escalas, setEscalas] = useState<any>({});

  const estaDentroDoHorario = (
    horaInicio?: string,
    horaFim?: string,
    dataAtual: Date = new Date(),
  ) => {
    if (!horaInicio || !horaFim) return false;

    const [inicioHora, inicioMin] = horaInicio.split(":").map(Number);
    const [fimHora, fimMin] = horaFim.split(":").map(Number);

    const inicio = new Date(dataAtual);
    inicio.setHours(inicioHora, inicioMin, 0, 0);

    const fim = new Date(dataAtual);
    fim.setHours(fimHora, fimMin, 0, 0);

    // cobre virada de dia, ex: 18:00 até 06:00
    if (fim <= inicio) {
      fim.setDate(fim.getDate() + 1);

      if (dataAtual < inicio) {
        const atualAjustado = new Date(dataAtual);
        atualAjustado.setDate(atualAjustado.getDate() + 1);
        return atualAjustado >= inicio && atualAjustado <= fim;
      }
    }

    return dataAtual >= inicio && dataAtual <= fim;
  };

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getPlantonistaDiaSemana();
      
      setEscalas(get);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const diaSemanaIndex = agora.getDay();
  const isFimDeSemana = diaSemanaIndex === 0 || diaSemanaIndex === 6;

  const isPlantaoAtivoSis = isFimDeSemana
    ? !!escalas?.sistemas
    : escalas?.sistemas?.diaSemana === diaSemanaIndex &&
      estaDentroDoHorario(
        escalas?.sistemas?.horaInicio,
        escalas?.sistemas?.horaFim,
        agora,
      );

  const isPlantaoAtivoInfra = isFimDeSemana
    ? !!escalas?.infra
    : escalas?.infra?.diaSemana === diaSemanaIndex &&
      estaDentroDoHorario(
        escalas?.infra?.horaInicio,
        escalas?.infra?.horaFim,
        agora,
      );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundImage: `url(${bgPlantao})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Overlay para escurecer o fundo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              pr: 4,
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              maxWidth: "fit-content",
            }}
            elevation={0}
          >
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "white",
                width: 56,
                height: 56,
                boxShadow: theme.shadows[4],
              }}
            >
              <img
                src={LogoPizzatto}
                alt="Logo Plantão TI - Pizzattolog"
                style={{ width: "80%", height: "100%", objectFit: "contain" }}
              />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "white", lineHeight: 1 }}
              >
                Plantão TI
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha(theme.palette.common.white, 0.8),
                  fontWeight: 500,
                }}
              >
                Pizzattolog
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => {
                window.location.replace("/");
              }}
              sx={{
                backdropFilter: "blur(10px)",
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                color: "white",
                borderColor: alpha(theme.palette.common.white, 0.3),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.3),
                  borderColor: alpha(theme.palette.common.white, 0.4),
                },
                boxShadow: theme.shadows[4],
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Voltar para Login
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PlantaoCard
              titulo="Sistemas"
              icon={Computer}
              plantonista={escalas.sistemas}
              ativo={isPlantaoAtivoSis}
              corBorda={theme.palette.warning.main}
              corIcone={theme.palette.warning.main}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PlantaoCard
              titulo="Infraestrutura / Redes"
              icon={Storage}
              plantonista={escalas.infra}
              ativo={isPlantaoAtivoInfra}
              corBorda={theme.palette.info.main}
              corIcone={theme.palette.info.main}
            />
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: "auto", py: 4, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.6),
              fontWeight: 500,
              textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.3)}`,
            }}
          >
            Atualização automática em tempo real
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PlantaoPrincipal;
