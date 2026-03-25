import {
  Box,
  Typography,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import { ArrowBack, Shield } from "@mui/icons-material";
import SidebarNew from "../../components/Sidebar";
import { useUser } from "../../UserContext";
import MembrosDaEquipe from "./components/MembrosDaEquipe";
import ConfiguracaoHorarios from "./components/ConfiguracaoHorarios";
import Escalas from "./components/Escalas";
import { grey } from "@mui/material/colors";

/* =====================
    TIPOS
===================== */
// type Area = "Sistemas" | "Infra";

// type Contato = {
//   id: string;
//   nome: string;
//   telefone: string;
//   area: Area;
// };

// const DIAS_SEMANA = [
//   { id: "segunda", label: "Segunda" },
//   { id: "terca", label: "Terça" },
//   { id: "quarta", label: "Quarta" },
//   { id: "quinta", label: "Quinta" },
//   { id: "sexta", label: "Sexta" },
//   { id: "sabado", label: "Sábado" },
//   { id: "domingo", label: "Domingo" },
// ];

const PlantaoAdmin = () => {
  const { user } = useUser();
  return (
    <SidebarNew>
      <Container maxWidth="lg" sx={{ bgcolor: grey[50], p: 2 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => {
                window.location.replace("/");
              }}
              size="large"
              sx={{
                border: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Configuração de Plantão
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Shield sx={{ fontSize: 16, color: "success.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Logado como {user?.name}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* SEÇÃO DE HORÁRIOS DO PLANTÃO */}
        <ConfiguracaoHorarios />

        {/* SEÇÃO: MEMBROS DA EQUIPE */}
        <MembrosDaEquipe />

        {/* SEÇÃO: ESCALAS SEMANAIS */}
        <Escalas />
      </Container>
    </SidebarNew>
  );
};

export default PlantaoAdmin;
