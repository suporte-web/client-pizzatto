import type { RefObject } from "react";
import { SidebarSubmenuSection } from "./SidebarSubmenuSection";
import type { SidebarSectionConfig } from "./menuConfig";
import { useSidebarSubmenu } from "./useSidebarSubMenu";

interface SidebarSectionRendererProps {
  section: SidebarSectionConfig;
  collapsed: boolean;
  pathname: string;
  menuScrollRef: RefObject<HTMLDivElement | null>;
}

export function SidebarSectionRenderer({
  section,
  collapsed,
  pathname,
  menuScrollRef,
}: SidebarSectionRendererProps) {
  const submenu = useSidebarSubmenu(menuScrollRef, collapsed);

  return (
    <SidebarSubmenuSection
      collapsed={collapsed}
      label={section.label}
      icon={section.icon}
      items={section.items}
      activePaths={section.items.map((item) => item.path)}
      pathname={pathname}
      {...submenu}
    />
  );
}