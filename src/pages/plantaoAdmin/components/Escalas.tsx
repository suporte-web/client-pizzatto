import { CalendarMonth, Event } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { PlantaoService } from "../../../stores/plantao/service";
import { useToast } from "../../../components/Toast";
import { useEffect, useState } from "react";

const DIAS_SEMANA = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

const escalaVazia: any = {
  segunda: "",
  terca: "",
  quarta: "",
  quinta: "",
  sexta: "",
  sabado: "",
  domingo: "",
};

const Escalas = () => {
  const { showToast } = useToast();

  const [contatos, setContatos] = useState<any[]>([]);
  const [escalaSistemas, setEscalaSistemas] =
    useState<any>(escalaVazia);
  const [escalaInfra, setEscalaInfra] =
    useState<any>(escalaVazia);

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getAllPlantonistas();
      setContatos(get ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataEscalas = async () => {
    try {
      const get = await PlantaoService.getAllEscalasAndHorarios();

      setEscalaSistemas(get?.escalaSistemas ?? escalaVazia);
      setEscalaInfra(get?.escalaInfra ?? escalaVazia);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataEscalas();
  }, []);

  const handleUpdateEscalas = async () => {
    try {
      await PlantaoService.updateEscalas({
        escalaSistemas,
        escalaInfra,
      });
      showToast("Sucesso ao configurar escalas", "success");
    } catch (error) {
      console.log(error);
      showToast("Erro ao configurar escalas", "error");
    }
  };

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
          Escalas
        </Typography>

        <Button
          variant="contained"
          onClick={handleUpdateEscalas}
          sx={{ borderRadius: "10px" }}
        >
          Atualizar
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
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
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            >
              <CalendarMonth />
              Escala Sistemas
            </Typography>

            <Stack spacing={3} mt={2}>
              {DIAS_SEMANA.map((dia) => (
                <Stack
                  key={dia.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography sx={{ width: 80, fontWeight: "medium" }}>
                    {dia.label}
                  </Typography>

                  <FormControl fullWidth size="small">
                    <InputLabel>Plantonista</InputLabel>
                    <Select
                      value={escalaSistemas[dia.id as keyof any] || ""}
                      label="Plantonista"
                      onChange={(e) =>
                        setEscalaSistemas((prev: any) => ({
                          ...prev,
                          [dia.id]: e.target.value,
                        }))
                      }
                    >
                      {contatos
                        .filter(
                          (c: any) =>
                            c.area === "Sistemas" && c.nome.trim() !== "",
                        )
                        .map((c: any) => (
                          <MenuItem key={c.id} value={c.nome}>
                            {c.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
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
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "success.main",
              }}
            >
              <CalendarMonth />
              Escala Infra
            </Typography>

            <Stack spacing={3} mt={2}>
              {DIAS_SEMANA.map((dia) => (
                <Stack
                  key={dia.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography sx={{ width: 80, fontWeight: "medium" }}>
                    {dia.label}
                  </Typography>

                  <FormControl fullWidth size="small">
                    <InputLabel>Plantonista</InputLabel>
                    <Select
                      value={escalaInfra[dia.id as keyof any] || ""}
                      label="Plantonista"
                      onChange={(e) =>
                        setEscalaInfra((prev: any) => ({
                          ...prev,
                          [dia.id]: e.target.value,
                        }))
                      }
                    >
                      {contatos
                        .filter(
                          (c: any) =>
                            c.area === "Infra" && c.nome.trim() !== "",
                        )
                        .map((c: any) => (
                          <MenuItem key={c.id} value={c.nome}>
                            {c.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Escalas;