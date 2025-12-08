import {
  HomeOutlined,
  ChevronLeft,
  ChevronRight,
  Logout,
  PersonOutlineOutlined,
  FileOpen,
  Inventory2Outlined,
  GavelOutlined,
  AdminPanelSettingsOutlined,
  Microsoft,
  Checklist,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Divider,
  Avatar,
  Tooltip,
  styled,
  useMediaQuery,
  alpha,
  Chip,
} from "@mui/material";
import { type ReactNode, useContext, useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  Sidebar,
  sidebarClasses,
  SubMenu,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import SidebarMobile from "./SidebarMobile";
import pizzattoImage from "../imgs/PizzattoLog_logo.png";

interface SidebarNewProps {
  children: ReactNode;
  title?: string;
}

const SidebarNew = ({ children, title }: SidebarNewProps) => {
  const { user } = useContext(UserContext);

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isOpen, setIsOpen] = useState<boolean>(
    localStorage.getItem("isOpen") === "true" || false
  );

  const toggleMenu = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("isOpen", isOpen ? "true" : "false");
    }
  }, [isOpen, isMobile]);

  const logout = () => {
    try {
      localStorage.clear();
      window.location.replace("/");
    } catch (error) {
      console.error("Erro durante o logout:", error);
    }
  };

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    margin: "6px 12px",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&.ps-active": {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      fontWeight: 600,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
      transform: "translateY(-1px)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.common.white,
          0.2
        )} 0%, transparent 100%)`,
        pointerEvents: "none",
      },
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      transform: "translateX(4px)",
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
    "& .ps-menu-icon": {
      marginRight: isOpen ? "0" : "12px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontSize: "20px",
    },
    "& .ps-menu-button": {
      padding: "12px 16px",
      minHeight: "48px",
    },
  }));

  // Estilos customizados para o SubMenu - CORRIGIDO
  const StyledSubMenu = styled(SubMenu)(({ theme }) => ({
    color: theme.palette.text.secondary,
    margin: "6px 12px",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "visible", // Mudado para visible para permitir overflow do submenu

    "& .ps-menu-button": {
      padding: "12px 16px",
      minHeight: "48px",
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: "translateX(4px)",
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
      },
    },

    "&.ps-active": {
      "& > .ps-menu-button": {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        fontWeight: 600,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.common.white,
            0.2
          )} 0%, transparent 100%)`,
          pointerEvents: "none",
        },
      },
    },

    "& .ps-menu-icon": {
      marginRight: isOpen ? "0" : "12px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontSize: "20px",
    },

    "& .ps-submenu-content": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
      backdropFilter: "blur(20px)",
      borderRadius: "12px",
      margin: "4px 12px",
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,

      position: "absolute",
      left: isOpen ? "100%" : "auto",
      top: 0,
      zIndex: 1000,

      /* ✅ Ajuste do tamanho dinâmico */
      width: "auto",
      minWidth: "fit-content",
      whiteSpace: "nowrap",
      paddingRight: "12px",

      "& .ps-menu-button": {
        paddingLeft: isOpen ? "16px" : "48px",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          transform: "translateX(2px)",
        },
      },

      "& .ps-active": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
  }));

  // Se for mobile, renderiza a sidebar na parte inferior
  if (isMobile) {
    return <SidebarMobile children={children} logout={logout} title={title} />;
  }

  // Renderização normal para desktop
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        collapsed={isOpen}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            background: `linear-gradient(180deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: "blur(20px)",
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
            width: isOpen ? "80px" : "260px",
            overflow: "visible", // Permite que o submenu transborde
          },
          height: "100%",
          position: "fixed",
          zIndex: 10,
          overflow: "visible", // Permite que o submenu transborde
        }}
        transitionDuration={300}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"72px"}
          px={3}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
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
          {!isOpen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={pizzattoImage}
                alt="Logo Pizzattolog"
                sx={{
                  height: 90,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                transform: "scale(1.05)",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.common.black,
                  0.15
                )}`,
              },
            }}
          >
            {isOpen ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        {/* User Profile */}
        <Box
          p={3}
          display="flex"
          alignItems="center"
          flexDirection={isOpen ? "column" : "row"}
          gap={2}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 0%, transparent 100%)`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 50%, transparent 100%)`,
            },
          }}
        >
          <Avatar
            sx={{
              width: isOpen ? 56 : 48,
              height: isOpen ? 56 : 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
              fontSize: isOpen ? "1.5rem" : "1.2rem",
              fontWeight: 600,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {user?.nome?.charAt(0).toUpperCase()}
          </Avatar>
          {!isOpen && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                }}
              >
                {user?.nome}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.text.secondary, 0.7),
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  maxWidth: "120px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={user?.email}
              >
                {user?.email}
              </Typography>
              {user?.acessos?.administrador && (
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: "18px",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    backgroundColor: alpha(theme.palette.warning.main, 0.15),
                    color: theme.palette.warning.main,
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        <Menu
          menuItemStyles={{
            button: {
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          }}
          rootStyles={{
            ["& > ul"]: {
              padding: "16px 0",
            },
          }}
        >
          <StyledMenuItem
            icon={<HomeOutlined />}
            component={<Link to={"/home"} />}
            active={location.pathname === "/home"}
          >
            {!isOpen && "Home"}
          </StyledMenuItem>

          {user?.acessos?.administrador && (
            <>
              <StyledSubMenu
                label={!isOpen && "Admin"}
                icon={<AdminPanelSettingsOutlined />}
              >
                <StyledMenuItem
                  icon={<PersonOutlineOutlined />}
                  component={<Link to={"/users"} />}
                  active={location.pathname === "/users"}
                >
                  Usuários
                </StyledMenuItem>
                <StyledMenuItem
                  icon={<PersonOutlineOutlined />}
                  component={<Link to={"/users-ad"} />}
                  active={location.pathname === "/users-ad"}
                >
                  Usuários AD
                </StyledMenuItem>
                <StyledSubMenu
                  label={"Infraestrutura"}
                  icon={<Inventory2Outlined />}
                >
                  <StyledMenuItem
                    component={<Link to={"/inventario"} />}
                    active={location.pathname === "/inventario"}
                  >
                    Inventário
                  </StyledMenuItem>
                  <StyledMenuItem
                    component={<Link to={"/inventario-impressoras"} />}
                    active={location.pathname === "/inventario-impressoras"}
                  >
                    Inventário Impressoras
                  </StyledMenuItem>
                  <StyledMenuItem
                    icon={<FileOpen />}
                    component={<Link to={"/pops"} />}
                    active={location.pathname === "/pops"}
                  >
                    {"POPs"}
                  </StyledMenuItem>
                  <StyledMenuItem
                    icon={<Microsoft />}
                    component={<Link to={"/contas-office"} />}
                    active={location.pathname === "/contas-office"}
                  >
                    {"Contas Office"}
                  </StyledMenuItem>
                </StyledSubMenu>
              </StyledSubMenu>
            </>
          )}

          <StyledSubMenu
            label={!isOpen && "Contratos"}
            icon={<GavelOutlined />}
          >
            <StyledMenuItem
              component={<Link to={"/pagina-principal-contratos"} />}
              active={location.pathname === "/pagina-principal-contratos"}
            >
              Página Principal
            </StyledMenuItem>
            <StyledMenuItem
              component={<Link to={"/cadastros-contratos"} />}
              active={location.pathname === "/cadastros-contratos"}
            >
              Cadastros
            </StyledMenuItem>
          </StyledSubMenu>

          <StyledMenuItem
            icon={<Checklist />}
            component={<Link to={"/to-do"} />}
            active={location.pathname === "/to-do"}
          >
            {!isOpen && "A Fazer"}
          </StyledMenuItem>
        </Menu>

        <Box
          p={3}
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            boxSizing: "border-box",
            background: `linear-gradient(180deg, transparent 0%, ${alpha(
              theme.palette.background.paper,
              0.8
            )} 100%)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Divider
            sx={{
              my: 2,
              background: `linear-gradient(90deg, transparent 0%, ${alpha(
                theme.palette.divider,
                0.3
              )} 50%, transparent 100%)`,
              height: "1px",
              border: "none",
            }}
          />
          <Tooltip title="Sair do sistema" placement="right" arrow>
            <IconButton
              onClick={logout}
              sx={{
                color: theme.palette.error.main,
                width: "100%",
                borderRadius: "12px",
                justifyContent: isOpen ? "center" : "flex-start",
                gap: 1.5,
                px: 2,
                // py: 1.5,
                minHeight: "48px",
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                backgroundColor: alpha(theme.palette.error.main, 0.05),
                // transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  borderColor: alpha(theme.palette.error.main, 0.4),
                  transform: "translateY(-2px)",
                  // boxShadow: `0 4px 16px ${alpha(
                  //   theme.palette.error.main,
                  //   0.2
                  // )}`,
                },
              }}
            >
              <Logout fontSize="small" />
              {!isOpen && (
                <Typography variant="body2" fontWeight={600}>
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
          ml: isOpen ? "80px" : "260px",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: `calc(100% - ${isOpen ? "80px" : "260px"})`,
        }}
      >
        <Box
          height={"72px"}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
            zIndex: 1,
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
          <Box display="flex" alignItems="center" gap={2}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: "white",
                textShadow: `0 2px 4px ${alpha(
                  theme.palette.common.black,
                  0.2
                )}`,
                letterSpacing: "-0.5px",
              }}
            >
              {title || location.pathname.split("/")[1] || "Home"}
            </Typography>
          </Box>
        </Box>

        <Box
          flex={1}
          overflow={"auto"}
          sx={{
            background: `linear-gradient(135deg, ${
              theme.palette.background.default
            } 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
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
          <Box sx={{ p: 4, position: "relative", zIndex: 1 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarNew;
