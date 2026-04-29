import {
  AccountTreeOutlined,
  AlternateEmail,
  BookOutlined,
  FileOpen,
  GavelOutlined,
  GradeOutlined,
  InfoOutlined,
  Inventory2Outlined,
  Microsoft,
  PeopleOutlineOutlined,
  PersonOutlineOutlined,
  PrivacyTipOutlined,
  WorkOutline,
  AdminPanelSettingsOutlined,
  Diversity3Outlined,
} from "@mui/icons-material";
import type { ReactNode } from "react";

export interface SidebarMenuItemConfig {
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface SidebarSectionConfig {
  key: string;
  label: string;
  icon: ReactNode;
  roles?: string[];
  items: SidebarMenuItemConfig[];
}

export const sidebarSections: SidebarSectionConfig[] = [
  {
    key: "admin",
    label: "Admin",
    icon: <AdminPanelSettingsOutlined />,
    roles: ["ADMIN", "DESENVOLVIMENTO"],
    items: [
      {
        label: "Organograma",
        path: "/organograma",
        icon: <AccountTreeOutlined />,
      },
    ],
  },
  {
    key: "ti",
    label: "TI",
    icon: <PrivacyTipOutlined />,
    roles: ["DESENVOLVIMENTO", "TI"],
    items: [
      {
        label: "Usuários AD",
        path: "/users-ad",
        icon: <PersonOutlineOutlined />,
      },
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
        label: "Contas Office",
        path: "/contas-office",
        icon: <Microsoft />,
      },
    ],
  },
  {
    key: "contratos",
    label: "Contratos",
    icon: <GavelOutlined />,
    roles: ["DESENVOLVIMENTO"],
    items: [
      {
        label: "Página Principal",
        path: "/pagina-principal-contratos",
      },
      {
        label: "Cadastros",
        path: "/cadastros-contratos",
      },
    ],
  },
  {
    key: "endomarketing",
    label: "EndoMarketing",
    icon: <GradeOutlined />,
    roles: ["ADMIN", "ENDOMARKETING", "DESENVOLVIMENTO"],
    items: [
      {
        label: "Assinatura de E-mail",
        path: "/assinatura-email",
        icon: <AlternateEmail />,
      },
    ],
  },
  {
    key: "area-colaborador",
    label: "Área do Colaborador",
    icon: <PeopleOutlineOutlined />,
    items: [
      {
        label: "POPs",
        path: "/pops",
        icon: <FileOpen />,
      },
    ],
  },
  {
    key: "cultura",
    label: "Cultura Pizzattolog",
    icon: <Diversity3Outlined />,
    roles: ["DESENVOLVIMENTO"],
    items: [
      {
        label: "Página Institucional",
        path: "/pagina-institucional",
        icon: <InfoOutlined />,
      },
      {
        label: "Biblioteca de Marca",
        path: "/biblioteca-marca",
        icon: <BookOutlined />,
      },
    ],
  },
];