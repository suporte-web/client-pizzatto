import {
  HomeOutlined,
  ChevronLeft,
  ChevronRight,
  Logout,
  Checklist,
  CalendarMonth,
  LocalPoliceOutlined,
  ChatBubbleOutline,
} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import pizzattoImage from "../imgs/PizzattoLog_logo.png";
import { StyledMenuItem } from "./componentsSidebar/styled";
import { sidebarSections } from "./componentsSidebar/menuConfig";
import { SidebarSectionRenderer } from "./componentsSidebar/SidebarSectionRenderer";
import SidebarMobile from "./componentsSidebar/SidebarMobile";

interface SidebarNewProps {
  children: ReactNode;
  title?: string;
}

const COLLAPSED_WIDTH = 100;
const EXPANDED_WIDTH = 260;

function titleFromPath(pathname: string) {
  const map: Record<string, string> = {
    "/home": "Home",
    "/users-ad": "Usuários AD",
    "/inventario": "Inventário",
    "/inventario-impressoras": "Inventário Impressoras",
    "/pops": "POPs",
    "/contas-office": "Contas Office",
    "/pagina-principal-contratos": "Página Principal",
    "/cadastros-contratos": "Cadastros",
    "/to-do": "A Fazer",
    "/organograma": "Organograma",
    "/calendario-institucional": "Calendário Institucional",
    "/assinatura-email": "Assinatura de E-mail",
    "/plantao": "Plantão",
    "/politicas": "Politicas",
    "/holerites": "Holerites",
    "/pagina-institucional": "Página Institucional",
    "/biblioteca-marca": "Biblioteca de Marca",
  };

  return map[pathname] ?? "Sistema";
}

const SidebarNew = ({ children, title }: SidebarNewProps) => {
  const { user } = useContext(UserContext);

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("isCollapsed") === "true" || false,
  );

  const menuScrollRef = useRef<HTMLDivElement | null>(null);

  const hasRole = (roles: string[]) =>
    roles.some((role) => user?.roles?.includes(role));

  const toggleMenu = () => {
    if (!isMobile) setIsCollapsed((v) => !v);
  };

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("isCollapsed", isCollapsed ? "true" : "false");
    }
  }, [isCollapsed, isMobile]);

  useEffect(() => {
    if (!isCollapsed) {
    }
  }, [isCollapsed]);

  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      window.location.replace("/");
    } catch (error) {
      console.error("Erro durante o logout:", error);
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Carregando usuário...
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <SidebarMobile
        logout={logout}
        title={title || titleFromPath(location.pathname)}
      >
        {children}
      </SidebarMobile>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        transitionDuration={300}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            background: `linear-gradient(180deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: "blur(20px)",
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
            width: drawerWidth,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "visible",
          },
          height: "100%",
          position: "fixed",
          zIndex: 10,
          overflow: "visible",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="72px"
          px={3}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            position: "relative",
          }}
        >
          {!isCollapsed && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={pizzattoImage}
                alt="Logo Pizzattolog"
                sx={{ height: 90, width: "auto", objectFit: "contain" }}
              />
            </Box>
          )}

          <IconButton
            onClick={toggleMenu}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            sx={{
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        <Box
          p={3}
          display="flex"
          alignItems="center"
          flexDirection={isCollapsed ? "column" : "row"}
          gap={2}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Avatar
            sx={{
              width: isCollapsed ? 56 : 48,
              height: isCollapsed ? 56 : 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              fontWeight: 700,
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>

          {!isCollapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={800} noWrap>
                {user.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                title={user.mail}
              >
                {user.mail}
              </Typography>

              {hasRole(["ADMIN"]) && (
                <Chip
                  label="ADMIN"
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    bgcolor: alpha(theme.palette.warning.main, 0.15),
                    color: theme.palette.warning.main,
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        <Box
          ref={menuScrollRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Menu rootStyles={{ ["& > ul"]: { padding: "16px 0" } }}>
            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<HomeOutlined />}
              component={<Link to="/home" />}
              active={location.pathname === "/home"}
            >
              {!isCollapsed && "Home"}
            </StyledMenuItem>

            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<ChatBubbleOutline />}
              component={<Link to="/chat-interno" />}
              active={location.pathname === "/chat-interno"}
            >
              {!isCollapsed && "Chat Interno"}
            </StyledMenuItem>

            {sidebarSections.map((section) => {
              if (section.roles && !hasRole(section.roles)) return null;

              return (
                <SidebarSectionRenderer
                  key={section.key}
                  section={section}
                  collapsed={isCollapsed}
                  pathname={location.pathname}
                  menuScrollRef={menuScrollRef}
                />
              );
            })}

            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<Checklist />}
              component={<Link to="/to-do" />}
              active={location.pathname === "/to-do"}
            >
              {!isCollapsed && "A Fazer"}
            </StyledMenuItem>

            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<CalendarMonth />}
              component={<Link to="/calendario-institucional" />}
              active={location.pathname === "/calendario-institucional"}
            >
              {!isCollapsed && "Calendário Institucional"}
            </StyledMenuItem>

            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<LocalPoliceOutlined />}
              component={<Link to="/politicas" />}
              active={location.pathname === "/politicas"}
            >
              {!isCollapsed && "Politicas"}
            </StyledMenuItem>
          </Menu>
        </Box>

        <Box p={2} sx={{ mt: "auto", width: "100%", boxSizing: "border-box" }}>
          <Divider sx={{ my: 2, opacity: 0.3 }} />
          <Tooltip title="Sair do sistema" placement="right" arrow>
            <IconButton
              onClick={logout}
              aria-label="Sair do sistema"
              sx={{
                color: theme.palette.error.main,
                width: "100%",
                borderRadius: "12px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: 1.5,
                px: 2,
                minHeight: "48px",
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              }}
            >
              <Logout fontSize="small" />
              {!isCollapsed && (
                <Typography variant="body2" fontWeight={700}>
                  Sair do Sistema
                </Typography>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Sidebar>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflowX: "hidden",
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          transition: isMobile
            ? "none"
            : "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Box
          height="72px"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: "flex",
            alignItems: "center",
            px: 4,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography variant="h5" fontWeight={800} sx={{ color: "white" }}>
            {title || titleFromPath(location.pathname)}
          </Typography>
        </Box>

        <Box
          flex={1}
          overflow="auto"
          sx={{
            bgcolor: "background.default",
            position: "relative",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Box sx={{ p: 4 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarNew;
