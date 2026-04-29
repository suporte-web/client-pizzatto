import { Logout } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { type ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { getMobileMenuItems } from "./componentsSidebarMobile/mobileMenuConfig";

interface SidebarMobileProps {
  children: ReactNode;
  logout: () => void;
  title?: string;
}

const SidebarMobile = ({ children, logout, title }: SidebarMobileProps) => {
  const { user } = useUser();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const hasRole = (roles?: string[]) => {
    if (!roles) return true;
    return roles.some((role) => user?.roles?.includes(role));
  };

  const menuItems = useMemo(() => {
    return getMobileMenuItems()
      .filter((item: any) => hasRole(item.roles))
      .slice(0, 5);
  }, [user?.roles]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          padding: "16px",
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ color: "white", fontSize: "0.9rem" }}
              >
                {user?.name}
              </Typography>

              {user?.roles?.includes("ADMIN") && (
                <Chip
                  label="ADMIN"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    backgroundColor: alpha(theme.palette.warning.main, 0.2),
                    color: theme.palette.warning.main,
                  }}
                />
              )}
            </Box>
          </Box>

          <IconButton
            onClick={logout}
            aria-label="Sair do sistema"
            sx={{
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: "white",
            textAlign: "center",
            mt: 1,
          }}
        >
          {title || "Sistema"}
        </Typography>
      </Box>

      <Box
        flex={1}
        overflow="auto"
        sx={{
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        <Box sx={{ p: 2, pb: 10 }}>{children}</Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.background.paper,
            0.95,
          )} 100%)`,
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{
            background: "transparent",
            height: 72,
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
              padding: "8px 4px",
              color: theme.palette.text.secondary,
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
              fontWeight: 700,
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.7rem",
            },
          }}
        >
          {menuItems.map((item: any) => (
            <BottomNavigationAction
              key={item.path}
              value={item.path}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.path)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default SidebarMobile;