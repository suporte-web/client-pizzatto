import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { PhoneOutlined } from "@mui/icons-material";

interface OrganogramaNode {
  dn: string;
  username?: string;
  nome: string;
  email?: string;
  cargo?: string;
  departamento?: string;
  managerDn?: string | null;
  lider?: string | null;
  subordinados: OrganogramaNode[];
  telefone?: string;
}

const getInitials = (nome: string) => {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};

const ColaboradorCard = ({ colaborador }: { colaborador: OrganogramaNode }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: 260,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "grey.200",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack spacing={1.6}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                fontSize: 14,
                fontWeight: 700,
                bgcolor: "primary.main",
              }}
            >
              {getInitials(colaborador.nome) || <PersonOutlineIcon />}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {colaborador.nome}
              </Typography>

              {colaborador.username && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.3 }}
                >
                  @{colaborador.username}
                </Typography>
              )}
            </Box>
          </Stack>

          <Divider />

          {colaborador.cargo && (
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutlineIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                {colaborador.cargo}
              </Typography>
            </Stack>
          )}

          {colaborador.departamento && (
            <Stack direction="row" spacing={1} alignItems="center">
              <BusinessOutlinedIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                {colaborador.departamento}
              </Typography>
            </Stack>
          )}

          {colaborador.email && (
            <Stack direction="row" spacing={1} alignItems="center">
              <AlternateEmailIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  fontSize: "0.8rem",
                }}
              >
                {colaborador.email}
              </Typography>
            </Stack>
          )}

          {colaborador.telefone && (
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  fontSize: "0.8rem",
                }}
              >
                {colaborador.telefone}
              </Typography>
            </Stack>
          )}

          {(colaborador.subordinados?.length ?? 0) > 0 && (
            <Box sx={{ pt: 0.5 }}>
              <Chip
                size="small"
                label={`${colaborador.subordinados.length} subordinado(s)`}
                color="primary"
                variant="filled"
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ColaboradorCard;
