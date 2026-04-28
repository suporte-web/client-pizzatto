import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Avatar,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { Computer, Storage, ArrowBack } from "@mui/icons-material";
import bgPlantao from "../../imgs/bg-plantao.jpg";
import LogoPizzatto from "../../imgs/image.png";
import { PlantaoService } from "../../stores/plantao/service";
import PlantaoCard from "./components/PlantaoCard";

type EscalaItem = {
  id: string;
  status: "DATA FIXA" | "RECORRENTE";
  dataJanela: string;
  diaSemana: string;
  diaSemanaNumero: number;
  nome: string;
  telefone: string;
  area: string;
  janelaInicio: string;
  janelaFim: string;
};

const PlantaoPrincipal = () => {
  const theme = useTheme();
  const [agora, setAgora] = useState(new Date());
  const [escalas, setEscalas] = useState<EscalaItem[]>([]);

  const normalizar = (valor?: string) =>
    valor
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const estaDentroDoHorarioPlantao = (
    dataJanela: string,
    horaInicio?: string,
    horaFim?: string,
    dataAtual: Date = new Date(),
  ) => {
    if (!dataJanela || !horaInicio || !horaFim) return false;

    const [inicioHora, inicioMin] = horaInicio.split(":").map(Number);
    const [fimHora, fimMin] = horaFim.split(":").map(Number);

    const [ano, mes, dia] = dataJanela.split("-").map(Number);

    const inicio = new Date(ano, mes - 1, dia, inicioHora, inicioMin, 0, 0);
    const fim = new Date(ano, mes - 1, dia, fimHora, fimMin, 0, 0);

    if (fim <= inicio) {
      fim.setDate(fim.getDate() + 1);
    }

    return dataAtual >= inicio && dataAtual <= fim;
  };

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getPlantonistasSemanaAtual();
      setEscalas(get ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const plantaoSistemas = escalas.find(
    (item) =>
      normalizar(item.area) === "sistemas" &&
      estaDentroDoHorarioPlantao(
        item.dataJanela,
        item.janelaInicio,
        item.janelaFim,
        agora,
      ),
  );

  const plantaoInfra = escalas.find(
    (item) =>
      normalizar(item.area) === "infra" &&
      estaDentroDoHorarioPlantao(
        item.dataJanela,
        item.janelaInicio,
        item.janelaFim,
        agora,
      ),
  );

  const sistemasCard = plantaoSistemas
    ? {
        nome: plantaoSistemas.nome,
        telefone: plantaoSistemas.telefone,
        inicio: plantaoSistemas.janelaInicio,
        fim: plantaoSistemas.janelaFim,
        area: plantaoSistemas.area,
      }
    : {
        nome: "",
        telefone: "",
        inicio: "",
        fim: "",
        area: "Sistemas",
      };

  const infraCard = plantaoInfra
    ? {
        nome: plantaoInfra.nome,
        telefone: plantaoInfra.telefone,
        inicio: plantaoInfra.janelaInicio,
        fim: plantaoInfra.janelaFim,
        area: plantaoInfra.area,
      }
    : {
        nome: "",
        telefone: "",
        inicio: "",
        fim: "",
        area: "Infra",
      };

  const isPlantaoAtivoSis = !!plantaoSistemas;
  const isPlantaoAtivoInfra = !!plantaoInfra;

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

        <Grid container spacing={3} sx={{ flex: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PlantaoCard
              titulo="Sistemas"
              icon={Computer}
              plantonista={sistemasCard}
              ativo={isPlantaoAtivoSis}
              corBorda={theme.palette.warning.main}
              corIcone={theme.palette.warning.main}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PlantaoCard
              titulo="Infraestrutura / Redes"
              icon={Storage}
              plantonista={infraCard}
              ativo={isPlantaoAtivoInfra}
              corBorda={theme.palette.info.main}
              corIcone={theme.palette.info.main}
            />
          </Grid>
        </Grid>

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