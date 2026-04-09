import { Box, Typography, Container, Stack } from "@mui/material";
import { Shield } from "@mui/icons-material";
import SidebarNew from "../../components/Sidebar";
import { useUser } from "../../UserContext";
import Escalas from "./components/Escalas";
import { grey } from "@mui/material/colors";
import ModalCreatePlantonista from "./components/ModalCreatePlantonista";
import ModalCreateMembrosEquipe from "./components/ModalCreateMembrosEquipe";

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
          {/* <Stack direction="row" spacing={2} alignItems="center"> */}
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <ModalCreateMembrosEquipe />
            <ModalCreatePlantonista />
          </Box>
          {/* </Stack> */}
        </Stack>

        {/* SEÇÃO DE HORÁRIOS DO PLANTÃO */}
        {/* <ConfiguracaoHorarios /> */}

        {/* SEÇÃO: MEMBROS DA EQUIPE */}
        {/* <MembrosDaEquipe /> */}

        {/* SEÇÃO: ESCALAS SEMANAIS */}
        <Escalas />
      </Container>
    </SidebarNew>
  );
};

export default PlantaoAdmin;
