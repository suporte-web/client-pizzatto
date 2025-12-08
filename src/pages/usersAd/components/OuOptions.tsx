import {
  Computer,
  AccountTree,
  MapOutlined,
  PersonOffOutlined,
  GroupsOutlined,
  ApartmentOutlined,
  GiteOutlined,
  OtherHousesOutlined,
  WarehouseOutlined,
  Inventory2Outlined,
  RecordVoiceOverOutlined,
  ContentCopyOutlined,
  RequestPageOutlined,
  ReportProblemOutlined,
  LocalShippingOutlined,
  HandymanOutlined,
  MonitorOutlined,
  DoorSlidingOutlined,
  CalendarTodayOutlined,
  InventoryOutlined,
  GppGoodOutlined,
  DoneOutlined,
  ContactPageOutlined,
  ThumbUpAltOutlined,
  TipsAndUpdatesOutlined,
  ManageAccountsOutlined,
  AttachMoneyOutlined,
  EmojiEventsOutlined,
  RingVolumeOutlined,
  ShoppingBagOutlined,
  CurrencyExchangeOutlined,
  PriceCheckOutlined,
} from "@mui/icons-material";
import type { JSX } from "react";

export interface OuOption {
  label: string;
  value: string; // distinguishedName da OU no AD
  icon: JSX.Element;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export const COSTEIRA_OPTIONS: OuOption[] = [
  {
    label: "Abastecimento",
    value:
      "OU=Abastecimento,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <Inventory2Outlined />,
    color: "warning",
  },
  {
    label: "Departamento Pessoal",
    value:
      "OU=Departamento Pessoal,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <RecordVoiceOverOutlined />,
    color: "warning",
  },
  {
    label: "Emissão",
    value:
      "OU=Emissao,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ContentCopyOutlined />,
    color: "warning",
  },
  {
    label: "Fiscal",
    value:
      "OU=Fiscal,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <RequestPageOutlined />,
    color: "warning",
  },
  {
    label: "Gerenciamento de Risco",
    value:
      "OU=Gerenciamento de Risco,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ReportProblemOutlined />,
    color: "warning",
  },
  {
    label: "Gestão Motoristas",
    value:
      "OU=Gestao Motoristas,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <LocalShippingOutlined />,
    color: "warning",
  },
  {
    label: "Manutenção",
    value:
      "OU=Manutencao,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <HandymanOutlined />,
    color: "warning",
  },
  {
    label: "Monitoramento",
    value:
      "OU=Monitoramento,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <MonitorOutlined />,
    color: "warning",
  },
  {
    label: "Portaria",
    value:
      "OU=Portaria,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <DoorSlidingOutlined />,
    color: "warning",
  },
  {
    label: "Programação",
    value:
      "OU=Programacao,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <CalendarTodayOutlined />,
    color: "warning",
  },
  {
    label: "Retropatio",
    value:
      "OU=Retropatio,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <InventoryOutlined />,
    color: "warning",
  },
  {
    label: "Segurança do Trabalho",
    value:
      "OU=Seguranca do Trabalho,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
  {
    label: "Subcontratados",
    value:
      "OU=Subcontratados,OU=Costeira,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <GppGoodOutlined />,
    color: "warning",
  },
];

export const PRINCIPAL_FOLDER_OPTIONS: OuOption[] = [
  {
    label: "Paraná",
    value: "Paraná",
    icon: <MapOutlined />,
    color: "primary",
  },
  {
    label: "São Paulo",
    value: "São Paulo",
    icon: <MapOutlined />,
    color: "primary",
  },
  {
    label: "Bahia",
    value: "Bahia",
    icon: <MapOutlined />,
    color: "success",
  },
  {
    label: "Desligados",
    value: "OU=Desligados,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <PersonOffOutlined />,
    color: "warning",
  },
  {
    label: "Ceara",
    value: "OU=Ceara,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <MapOutlined />,
    color: "warning",
  },
  {
    label: "Terceiros",
    value: "Terceiros",
    icon: <GroupsOutlined />,
    color: "warning",
  },
];

export const PARANA_OPTIONS: OuOption[] = [
  {
    label: "Matriz",
    value: "Matriz",
    icon: <ApartmentOutlined />,
    color: "primary",
  },
  {
    label: "Costeira",
    value: "Costeira",
    icon: <GiteOutlined />,
    color: "success",
  },
  {
    label: "Portal do Aeroporto",
    value:
      "OU=Portal do Aeroporto,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <OtherHousesOutlined />,
    color: "warning",
  },
  {
    label: "COP Boticario",
    value: "OU=Cop Boticario,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <OtherHousesOutlined />,
    color: "warning",
  },
  {
    label: "CEP Portão",
    value: "OU=Cep Portao,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <WarehouseOutlined />,
    color: "warning",
  },
  {
    label: "Campina Grande",
    value: "OU=Campina Grande,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <WarehouseOutlined />,
    color: "warning",
  },
];

export const SAO_PAULO_OPTIONS: OuOption[] = [
  {
    label: "Araraquara",
    value: "OU=Araraquara,OU=Sao Paulo,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
  {
    label: "Guarulhos",
    value: "OU=Guarulhos,OU=Sao Paulo,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
];

export const BAHIA_OPTIONS: OuOption[] = [
  {
    label: "Camaçari",
    value: "OU=Camacari,OU=Bahia,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
  {
    label: "Feira de Santana",
    value: "OU=Feira de Santana,OU=Bahia,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
  {
    label: "São Gonçalo",
    value: "OU=Sao Goncalo,OU=Bahia,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
];

export const TERCEIROS_OPTIONS: OuOption[] = [
  {
    label: "Grupo Davinci",
    value: "OU=Grupo Davinci,OU=Terceiros,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AccountTree />,
    color: "warning",
  },
];

export const MATRIZ_OPTIONS: OuOption[] = [
  {
    label: "TI",
    value: "OU=TI,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <Computer />,
    color: "primary",
  },
  {
    label: "Validação",
    value:
      "OU=Validacao,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <DoneOutlined />,
    color: "success",
  },
  {
    label: "RH",
    value: "OU=RH,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ContactPageOutlined />,
    color: "secondary",
  },
  {
    label: "Qualidade",
    value:
      "OU=Qualidade,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ThumbUpAltOutlined />,
    color: "warning",
  },
  {
    label: "Marketing",
    value:
      "OU=Marketing,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <TipsAndUpdatesOutlined />,
    color: "warning",
  },
  {
    label: "Manutenção",
    value:
      "OU=Manutencao,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <HandymanOutlined />,
    color: "warning",
  },
  {
    label: "Gerencia",
    value:
      "OU=Gerencia,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ManageAccountsOutlined />,
    color: "warning",
  },
  {
    label: "Financeiro",
    value:
      "OU=Financeiro,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <AttachMoneyOutlined />,
    color: "warning",
  },
  {
    label: "Diretoria",
    value:
      "OU=Diretoria,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <EmojiEventsOutlined />,
    color: "warning",
  },
  {
    label: "Controladoria",
    value:
      "OU=Controladoria,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <RingVolumeOutlined />,
    color: "warning",
  },
  {
    label: "Contabilidade",
    value:
      "OU=Contabilidade,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <CurrencyExchangeOutlined />,
    color: "warning",
  },
  {
    label: "Compras",
    value: "OU=Compras,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <ShoppingBagOutlined />,
    color: "warning",
  },
  {
    label: "Comercial",
    value:
      "OU=Comercial,OU=Matriz,OU=Parana,OU=PIZZATTOLOG,DC=pizzatto,DC=local",
    icon: <PriceCheckOutlined />,
    color: "warning",
  },
];
