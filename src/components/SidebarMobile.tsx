// SidebarMobile.tsx
import {
  HomeOutlined,
  PersonOutlineOutlined,
  SellOutlined,
  SupportAgentOutlined,
  Groups2Outlined,
  Logout,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  Chip,
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { type ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

interface SidebarMobileProps {
  children: ReactNode;
  logout: () => void;
  title?: string;
}

const SidebarMobile = ({ children, logout, title }: SidebarMobileProps) => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/home", icon: <HomeOutlined />, label: "Home" },
    { path: "/users", icon: <PersonOutlineOutlined />, label: "Usuários" },
    { path: "/vendedores", icon: <SupportAgentOutlined />, label: "Vendedores" },
    { path: "/vendidos", icon: <SellOutlined />, label: "Vendidos" },
    { path: "/grupos", icon: <Groups2Outlined />, label: "Grupos" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          padding: "16px",
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${alpha(
              theme.palette.common.white,
              0.2
            )} 50%, transparent 100%)`,
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.secondary.main, 0.3)}`,
                border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {user?.nome?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  color: "white",
                  fontSize: "0.9rem",
                }}
              >
                {user?.nome}
              </Typography>
              {user?.administrador && (
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    height: "16px",
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    backgroundColor: alpha(theme.palette.warning.main, 0.2),
                    color: theme.palette.warning.main,
                  }}
                />
              )}
            </Box>
          </Box>

          <IconButton
            onClick={logout}
            sx={{
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "white",
            textAlign: "center",
            mt: 1,
            textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`,
            background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${alpha(
              theme.palette.common.white,
              0.8
            )} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title || "Aguiar Consórcio"}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        flex={1}
        overflow={"auto"}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
            theme.palette.background.default,
            0.8
          )} 100%)`,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 50% 50%, ${alpha(
              theme.palette.primary.main,
              0.03
            )} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ p: 2, position: "relative", zIndex: 1, pb: 8 }}>
          {children}
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 100%)`,
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 -4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{
            background: "transparent",
            height: "72px",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
              padding: "8px 4px",
              color: theme.palette.text.secondary,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
                transform: "translateY(-2px)",
              },
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.7rem",
              fontWeight: 500,
              marginTop: "4px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&.Mui-selected": {
                fontSize: "0.75rem",
                fontWeight: 600,
              },
            },
          }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              value={item.path}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default SidebarMobile;