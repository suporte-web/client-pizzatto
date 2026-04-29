import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { StyledMenuItem, StyledSubMenu } from "./styled";

interface SidebarSubmenuSectionProps {
  collapsed: boolean;
  label: string;
  icon: ReactNode;
  items: {
    label: string;
    path: string;
    icon?: ReactNode;
  }[];
  activePaths: string[];
  pathname: string;
  popoutTop: number;
  openPopout: boolean;
  openExpanded: boolean;
  setOpenPopout: (value: boolean) => void;
  setOpenExpanded: (value: boolean) => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  recalcTop: () => void;
}

export function SidebarSubmenuSection({
  collapsed,
  label,
  icon,
  items,
  activePaths,
  pathname,
  popoutTop,
  openPopout,
  openExpanded,
  setOpenPopout,
  setOpenExpanded,
  wrapperRef,
  recalcTop,
}: SidebarSubmenuSectionProps) {
  const isActive = activePaths.includes(pathname);

  return (
    <Box
      ref={wrapperRef}
      onMouseEnter={() => {
        if (!collapsed) return;
        recalcTop();
        setOpenPopout(true);
      }}
      onMouseLeave={() => {
        if (!collapsed) return;
        setOpenPopout(false);
      }}
      sx={{ position: "relative" }}
    >
      <StyledSubMenu
        collapsed={collapsed}
        label={!collapsed && label}
        icon={icon}
        open={collapsed ? openPopout : openExpanded}
        onOpenChange={(open) => {
          if (!collapsed) setOpenExpanded(open);
        }}
        className={isActive ? "ps-active" : undefined}
        rootStyles={
          collapsed
            ? {
                ["& .ps-submenu-content"]: {
                  top: `${popoutTop}px`,
                },
              }
            : undefined
        }
      >
        {items.map((item) => (
          <StyledMenuItem
            key={item.path}
            collapsed={collapsed}
            icon={item.icon}
            component={<Link to={item.path} />}
            active={pathname === item.path}
          >
            {item.label}
          </StyledMenuItem>
        ))}
      </StyledSubMenu>
    </Box>
  );
}