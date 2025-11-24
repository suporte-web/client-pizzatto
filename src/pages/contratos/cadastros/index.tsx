import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  alpha,
  type ContainerProps,
} from "@mui/material";
import SidebarNew from "../../../components/Sidebar";
import { useState } from "react";
import Clientes from "./components/clientes";
import Fornecedores from "./components/fornecedores";
import Fases from "./components/fases";
import ValoresDeContratos from "./components/valoresDeContratos";
import Filiais from "./components/filial";

const CadastrosContratos = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const theme = useTheme();

  const statusList = [
    "CLIENTES",
    "FORNECEDORES",
    "FASES",
    "VALORES DE CONTRATOS",
    'FILIAL'
  ];

  const [selectedContrato, setSelectedContrato] = useState("CLIENTES");

  // Cores para cada tab (opcional)
  const getTabColor = (tabValue: string) => {
    const colors = {
      CLIENTES: theme.palette.primary.main,
      FORNECEDORES: theme.palette.info.main,
      FASES: theme.palette.primary.main,
      "VALORES DE CONTRATOS": theme.palette.info.main,
      FILIAL: theme.palette.primary.main,
    };
    return (
      colors[tabValue as keyof typeof colors] || theme.palette.primary.main
    );
  };

  return (
    <SidebarNew title={`Cadastros de informações dos Contratos`}>
      <Container {...containerProps}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.8
            )} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Tabs
            value={selectedContrato}
            onChange={(_, newValue) => setSelectedContrato(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              background: `linear-gradient(to right, ${alpha(
                theme.palette.primary.main,
                0.02
              )} 0%, ${alpha(theme.palette.background.paper, 0.1)} 100%)`,
              "& .MuiTabs-scrollButtons": {
                color: theme.palette.primary.main,
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
              "& .MuiTab-root": {
                minHeight: 68,
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
                position: "relative",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "12px 12px 0 0",
                margin: "4px 2px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  transform: "translateY(-2px)",
                  "&::before": {
                    opacity: 1,
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${getTabColor(
                    selectedContrato
                  )} 0%, ${alpha(getTabColor(selectedContrato), 0.5)} 100%)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 0,
                  height: 4,
                  background: `linear-gradient(90deg, transparent 0%, ${getTabColor(
                    selectedContrato
                  )} 50%, transparent 100%)`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "translateX(-50%)",
                  borderRadius: "2px",
                },
                "&.Mui-selected": {
                  color: getTabColor(selectedContrato),
                  backgroundColor: alpha(getTabColor(selectedContrato), 0.08),
                  "&::after": {
                    width: "70%",
                  },
                  "&::before": {
                    opacity: 1,
                  },
                },
              },
            }}
          >
            {statusList.map((status: string) => (
              <Tab
                key={status}
                label={
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        transition: "all 0.2s ease",
                      }}
                    >
                      {status}
                    </Typography>
                    {/* Indicador de status ativo */}
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor:
                          selectedContrato === status
                            ? getTabColor(status)
                            : "transparent",
                        transition: "all 0.3s ease",
                        opacity: selectedContrato === status ? 1 : 0,
                      }}
                    />
                  </Box>
                }
                value={status}
                sx={{
                  color: theme.palette.text.secondary,
                  minWidth: { xs: 140, md: 160 },
                  px: 3,
                  py: 1,
                  "&.Mui-selected": {
                    color: getTabColor(status),
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Conteúdo com animação suave */}
        <Box
          sx={{
            animation: "fadeIn 0.4s ease-in-out",
            "@keyframes fadeIn": {
              from: {
                opacity: 0,
                transform: "translateY(10px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {selectedContrato === "CLIENTES" && <Clientes />}
          {selectedContrato === "FORNECEDORES" && <Fornecedores />}
          {selectedContrato === "FASES" && <Fases />}
          {selectedContrato === "VALORES DE CONTRATOS" && (
            <ValoresDeContratos />
          )}
          {selectedContrato === "FILIAL" && (
            <Filiais />
          )}
        </Box>
      </Container>
    </SidebarNew>
  );
};

export default CadastrosContratos;
