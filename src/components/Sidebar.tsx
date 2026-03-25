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
  AccountTreeOutlined,
  CalendarMonth,
  AlternateEmail,
  GradeOutlined,
  WorkOutline,
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
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const COLLAPSED_WIDTH = 100;
const EXPANDED_WIDTH = 260;
const POPOUT_GAP = 8;

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
    plantao: "Plantão",
  };

  return map[pathname] ?? "Sistema";
}

const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  color: theme.palette.text.secondary,
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",

  "&.ps-active": {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    fontWeight: 700,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: `linear-gradient(135deg, ${alpha(
        theme.palette.common.white,
        0.2,
      )} 0%, transparent 100%)`,
      pointerEvents: "none",
    },
  },

  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateX(4px)",
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
  },

  "& .ps-menu-button": {
    padding: "12px 16px",
    minHeight: "48px",
  },

  "& .ps-menu-icon": {
    marginRight: collapsed ? "0" : "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "20px",
  },
}));

const StyledSubMenu = styled(SubMenu, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
  color: theme.palette.text.secondary,
  margin: "6px 12px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "visible",

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
      fontWeight: 700,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
  },

  "& .ps-menu-icon": {
    marginRight: collapsed ? "0" : "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "20px",
  },

  "& .ps-submenu-expand-icon": {
    display: collapsed ? "none" : "block",
  },

  "& .ps-submenu-content": {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: "blur(20px)",
    borderRadius: "12px",
    margin: 0,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
    zIndex: 3000,
    width: "max-content",
    minWidth: "220px",
    whiteSpace: "nowrap",
    paddingRight: "12px",
    overflow: "visible",

    position: collapsed ? "fixed" : "static",
    left: collapsed ? `calc(${COLLAPSED_WIDTH}px + ${POPOUT_GAP}px)` : "auto",

    "& .ps-menu-button": {
      paddingLeft: collapsed ? "16px" : "48px",
    },
  },
}));

const SidebarNew = ({ children, title }: SidebarNewProps) => {
  const { user } = useContext(UserContext);

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    localStorage.getItem("isCollapsed") === "true" || false,
  );

  const menuScrollRef = useRef<HTMLDivElement | null>(null);
  const adminWrapperRef = useRef<HTMLDivElement | null>(null);
  const contratosWrapperRef = useRef<HTMLDivElement | null>(null);
  const endoMarketingWrapperRef = useRef<HTMLDivElement | null>(null);

  const [openAdminPopout, setOpenAdminPopout] = useState(false);
  const [adminPopoutTop, setAdminPopoutTop] = useState<number>(0);

  const [openContratosPopout, setOpenContratosPopout] = useState(false);
  const [contratosPopoutTop, setContratosPopoutTop] = useState<number>(0);

  const [openAdminExpanded, setOpenAdminExpanded] = useState(false);
  const [openInfraExpanded, setOpenInfraExpanded] = useState(false);
  const [openContratosExpanded, setOpenContratosExpanded] = useState(false);

  const [openEndoMarketingPopout, setOpenEndoMarketingPopout] = useState(false);
  const [endoMarketingPopoutTop, setEndoMarketingPopoutTop] =
    useState<number>(0);
  const [openEndoMarketingExpanded, setOpenEndoMarketingExpanded] =
    useState(false);

  const calcTopFromElement = (el: HTMLElement | null) => {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.top;
  };

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
      setOpenAdminExpanded(false);
      setOpenInfraExpanded(false);
      setOpenContratosExpanded(false);
      setOpenEndoMarketingExpanded(false);
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

  const adminItems = useMemo(
    () => [
      {
        label: "Usuários AD",
        path: "/users-ad",
        icon: <PersonOutlineOutlined />,
      },
      {
        label: "Organograma",
        path: "/organograma",
        icon: <AccountTreeOutlined />,
      },
    ],
    [],
  );

  const tiItems = useMemo(
    () => [
      {
        label: "Plantão",
        path: "/plantao",
        icon: <WorkOutline />,
      },
      {
        label: "Inventário",
        path: "/inventario",
        icon: <Inventory2Outlined />,
      },
      {
        label: "Inventário Impressoras",
        path: "/inventario-impressoras",
        icon: <Inventory2Outlined />,
      },
      {
        label: "POPs",
        path: "/pops",
        icon: <FileOpen />,
      },
      {
        label: "Contas Office",
        path: "/contas-office",
        icon: <Microsoft />,
      },
    ],
    [],
  );

  const contratosItems = useMemo(
    () => [
      {
        label: "Página Principal",
        path: "/pagina-principal-contratos",
      },
      {
        label: "Cadastros",
        path: "/cadastros-contratos",
      },
    ],
    [],
  );

  const endoMarketingItems = useMemo(
    () => [
      {
        label: "Assinatura de E-mail",
        path: "/assinatura-email",
        icon: <AlternateEmail />,
      },
    ],
    [],
  );

  const adminRoutes = useMemo(
    () => [
      "/users-ad",
      "/inventario",
      "/inventario-impressoras",
      "/pops",
      "/contas-office",
      "/organograma",
    ],
    [],
  );

  const infraRoutes = useMemo(
    () => ["/inventario", "/inventario-impressoras", "/pops", "/contas-office"],
    [],
  );

  const contratosRoutes = useMemo(
    () => ["/pagina-principal-contratos", "/cadastros-contratos"],
    [],
  );

  const endoMarketingRoutes = useMemo(() => ["/assinatura-email"], []);

  const adminIsActive = useMemo(
    () => adminRoutes.includes(location.pathname),
    [adminRoutes, location.pathname],
  );

  const infraIsActive = useMemo(
    () => infraRoutes.includes(location.pathname),
    [infraRoutes, location.pathname],
  );

  const contratosIsActive = useMemo(
    () => contratosRoutes.includes(location.pathname),
    [contratosRoutes, location.pathname],
  );

  const endoMarketingIsActive = useMemo(
    () => endoMarketingRoutes.includes(location.pathname),
    [endoMarketingRoutes, location.pathname],
  );

  const recalcAdminTop = () => {
    const root = adminWrapperRef.current;
    const btn = root?.querySelector(".ps-menu-button") as HTMLElement | null;
    setAdminPopoutTop(calcTopFromElement(btn));
  };

  const recalcContratosTop = () => {
    const root = contratosWrapperRef.current;
    const btn = root?.querySelector(".ps-menu-button") as HTMLElement | null;
    setContratosPopoutTop(calcTopFromElement(btn));
  };

  const recalcEndoMarketingTop = () => {
    const root = endoMarketingWrapperRef.current;
    const btn = root?.querySelector(".ps-menu-button") as HTMLElement | null;
    setEndoMarketingPopoutTop(calcTopFromElement(btn));
  };

  useEffect(() => {
    if (!openAdminPopout || !isCollapsed) return;
    const el = menuScrollRef.current;
    if (!el) return;

    const onScroll = () => recalcAdminTop();
    el.addEventListener("scroll", onScroll, { passive: true });

    recalcAdminTop();

    return () => el.removeEventListener("scroll", onScroll);
  }, [openAdminPopout, isCollapsed]);

  useEffect(() => {
    if (!openContratosPopout || !isCollapsed) return;
    const el = menuScrollRef.current;
    if (!el) return;

    const onScroll = () => recalcContratosTop();
    el.addEventListener("scroll", onScroll, { passive: true });

    recalcContratosTop();

    return () => el.removeEventListener("scroll", onScroll);
  }, [openContratosPopout, isCollapsed]);

  useEffect(() => {
    if (!openEndoMarketingPopout || !isCollapsed) return;
    const el = menuScrollRef.current;
    if (!el) return;

    const onScroll = () => recalcEndoMarketingTop();
    el.addEventListener("scroll", onScroll, { passive: true });

    recalcEndoMarketingTop();

    return () => el.removeEventListener("scroll", onScroll);
  }, [openEndoMarketingPopout, isCollapsed]);

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
    return <SidebarMobile children={children} logout={logout} title={title} />;
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

              {user.roles?.includes("ADMIN") && (
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
          <Menu
            rootStyles={{ ["& > ul"]: { padding: "16px 0" } }}
            menuItemStyles={{ button: { transition: "all 0.2s ease" } }}
          >
            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<HomeOutlined />}
              component={<Link to="/home" />}
              active={location.pathname === "/home"}
            >
              {!isCollapsed && "Home"}
            </StyledMenuItem>

            {user.roles?.includes("ADMIN") && (
              <Box
                ref={adminWrapperRef}
                onMouseEnter={() => {
                  if (!isCollapsed) return;
                  recalcAdminTop();
                  setOpenAdminPopout(true);
                }}
                onMouseLeave={() => {
                  if (!isCollapsed) return;
                  setOpenAdminPopout(false);
                }}
                sx={{ position: "relative" }}
              >
                <StyledSubMenu
                  collapsed={isCollapsed}
                  label={!isCollapsed && "Admin"}
                  icon={<AdminPanelSettingsOutlined />}
                  open={isCollapsed ? openAdminPopout : openAdminExpanded}
                  onOpenChange={(open) => {
                    if (!isCollapsed) setOpenAdminExpanded(open);
                  }}
                  className={adminIsActive ? "ps-active" : undefined}
                  rootStyles={
                    isCollapsed
                      ? {
                          ["& .ps-submenu-content"]: {
                            top: `${adminPopoutTop}px`,
                          },
                        }
                      : undefined
                  }
                >
                  {adminItems.map((item) => (
                    <StyledMenuItem
                      key={item.path}
                      collapsed={isCollapsed}
                      icon={item.icon}
                      component={<Link to={item.path} />}
                      active={location.pathname === item.path}
                    >
                      {item.label}
                    </StyledMenuItem>
                  ))}

                  {isCollapsed ? (
                    <>
                      <Box
                        sx={{
                          px: 2,
                          pt: 1.5,
                          pb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            color: theme.palette.text.secondary,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Infraestrutura
                        </Typography>
                      </Box>

                      {tiItems.map((item) => (
                        <StyledMenuItem
                          key={item.path}
                          collapsed={isCollapsed}
                          icon={item.icon}
                          component={<Link to={item.path} />}
                          active={location.pathname === item.path}
                        >
                          {item.label}
                        </StyledMenuItem>
                      ))}
                    </>
                  ) : (
                    <StyledSubMenu
                      collapsed={isCollapsed}
                      label="TI"
                      icon={<Inventory2Outlined />}
                      open={openInfraExpanded}
                      onOpenChange={(open) => {
                        setOpenInfraExpanded(open);
                      }}
                      className={infraIsActive ? "ps-active" : undefined}
                    >
                      {tiItems.map((item) => (
                        <StyledMenuItem
                          key={item.path}
                          collapsed={isCollapsed}
                          icon={item.icon}
                          component={<Link to={item.path} />}
                          active={location.pathname === item.path}
                        >
                          {item.label}
                        </StyledMenuItem>
                      ))}
                    </StyledSubMenu>
                  )}
                </StyledSubMenu>
              </Box>
            )}

            <Box
              ref={contratosWrapperRef}
              onMouseEnter={() => {
                if (!isCollapsed) return;
                recalcContratosTop();
                setOpenContratosPopout(true);
              }}
              onMouseLeave={() => {
                if (!isCollapsed) return;
                setOpenContratosPopout(false);
              }}
              sx={{ position: "relative" }}
            >
              <StyledSubMenu
                collapsed={isCollapsed}
                label={!isCollapsed && "Contratos"}
                icon={<GavelOutlined />}
                open={isCollapsed ? openContratosPopout : openContratosExpanded}
                onOpenChange={(open) => {
                  if (!isCollapsed) setOpenContratosExpanded(open);
                }}
                className={contratosIsActive ? "ps-active" : undefined}
                rootStyles={
                  isCollapsed
                    ? {
                        ["& .ps-submenu-content"]: {
                          top: `${contratosPopoutTop}px`,
                        },
                      }
                    : undefined
                }
              >
                {contratosItems.map((item) => (
                  <StyledMenuItem
                    key={item.path}
                    collapsed={isCollapsed}
                    component={<Link to={item.path} />}
                    active={location.pathname === item.path}
                  >
                    {item.label}
                  </StyledMenuItem>
                ))}
              </StyledSubMenu>
            </Box>

            {user.roles?.includes("ADMIN", "ENDOMARKETING") && (
              <Box
                ref={endoMarketingWrapperRef}
                onMouseEnter={() => {
                  if (!isCollapsed) return;
                  recalcEndoMarketingTop();
                  setOpenEndoMarketingPopout(true);
                }}
                onMouseLeave={() => {
                  if (!isCollapsed) return;
                  setOpenEndoMarketingPopout(false);
                }}
                sx={{ position: "relative" }}
              >
                <StyledSubMenu
                  collapsed={isCollapsed}
                  label={!isCollapsed && "EndoMarketing"}
                  icon={<GradeOutlined />}
                  open={
                    isCollapsed
                      ? openEndoMarketingPopout
                      : openEndoMarketingExpanded
                  }
                  onOpenChange={(open) => {
                    if (!isCollapsed) setOpenEndoMarketingExpanded(open);
                  }}
                  className={endoMarketingIsActive ? "ps-active" : undefined}
                  rootStyles={
                    isCollapsed
                      ? {
                          ["& .ps-submenu-content"]: {
                            top: `${endoMarketingPopoutTop}px`,
                          },
                        }
                      : undefined
                  }
                >
                  {endoMarketingItems.map((item) => (
                    <StyledMenuItem
                      key={item.path}
                      collapsed={isCollapsed}
                      icon={item.icon}
                      component={<Link to={item.path} />}
                      active={location.pathname === item.path}
                    >
                      {item.label}
                    </StyledMenuItem>
                  ))}
                </StyledSubMenu>
              </Box>
            )}

            <StyledMenuItem
              collapsed={isCollapsed}
              icon={<Checklist />}
              component={<Link to="/to-do" />}
              active={location.pathname === "/to-do"}
            >
              {!isCollapsed && "A Fazer"}
            </StyledMenuItem>

            {user.roles?.includes("ADMIN") && (
              <StyledMenuItem
                collapsed={isCollapsed}
                icon={<CalendarMonth />}
                component={<Link to="/calendario-institucional" />}
                active={location.pathname === "/calendario-institucional"}
              >
                {!isCollapsed && "Calendário Institucional"}
              </StyledMenuItem>
            )}
          </Menu>
        </Box>

        <Box
          p={2}
          sx={{
            mt: "auto",
            width: "100%",
            boxSizing: "border-box",
            background: `linear-gradient(180deg, transparent 0%, ${alpha(
              theme.palette.background.paper,
              0.8,
            )} 100%)`,
          }}
        >
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
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  borderColor: alpha(theme.palette.error.main, 0.4),
                },
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
