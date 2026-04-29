import { alpha, styled } from "@mui/material";
import { MenuItem, SubMenu } from "react-pro-sidebar";

const COLLAPSED_WIDTH = 100;
const POPOUT_GAP = 8;

export const StyledMenuItem = styled(MenuItem, {
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

export const StyledSubMenu = styled(SubMenu, {
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