// componentsSidebar/mobileMenuConfig.tsx
import {
  CalendarMonth,
  ChatBubbleOutline,
//   Checklist,
  HomeOutlined,
  LocalPoliceOutlined,
} from "@mui/icons-material";
import type { ReactNode } from "react";
import { sidebarSections } from "../menuConfig";

export interface MobileMenuItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles?: string[];
}

export const fixedMobileItems: MobileMenuItem[] = [
  {
    label: "Home",
    path: "/home",
    icon: <HomeOutlined />,
  },
  {
    label: "Chat",
    path: "/chat-interno",
    icon: <ChatBubbleOutline />,
  },
//   {
//     label: "A Fazer",
//     path: "/to-do",
//     icon: <Checklist />,
//   },
  {
    label: "Calendário",
    path: "/calendario-institucional",
    icon: <CalendarMonth />,
  },
  {
    label: "Políticas",
    path: "/politicas",
    icon: <LocalPoliceOutlined />,
  },
];

export function getMobileMenuItems() {
  const submenuItems = sidebarSections.flatMap((section: any) =>
    section.items.map((item: any) => ({
      label: item.label,
      path: item.path,
      icon: item.icon ?? section.icon,
      roles: section.roles,
    })),
  );

  return [...fixedMobileItems, ...submenuItems];
}
