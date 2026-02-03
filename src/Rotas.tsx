import { Route, Routes } from "react-router-dom";

// Importe seus componentes de página aqui
import { UserProvider } from "./UserContext";
import Login from "./pages/login";
import Home from "./pages/home";
import Users from "./pages/users";
import POPs from "./pages/pops";
import Inventario from "./pages/inventario";
import InventarioImpressoras from "./pages/inventarioImpressoras";
import PaginaPrincipalContratos from "./pages/contratos/paginaPrincipal";
import ControleContratos from "./pages/contratos/controleContratos";
import CadastrosContratos from "./pages/contratos/cadastros";
import ContasOffice from "./pages/contasOffice";
import ToDo from "./pages/toDo";
import UsersAd from "./pages/usersAd";
import PlantaoPagePrincipal from "./pages/plantaoTi/pagePrincipal";
import PlantaoPageAdmin from "./pages/plantaoTi/pageAdmin";

const Rotas = () => (
  <Routes>
    <Route path="/" index element={<Login />} />
    <Route path="/plantao/page-principal" element={<PlantaoPagePrincipal />} />
    <Route path="/plantao/page-admin" element={<PlantaoPageAdmin />} />
    <Route
      path="/home"
      element={
        <UserProvider>
          <Home />
        </UserProvider>
      }
    />
    <Route
      path="/users"
      element={
        <UserProvider>
          <Users />
        </UserProvider>
      }
    />
    <Route
      path="/pops"
      element={
        <UserProvider>
          <POPs />
        </UserProvider>
      }
    />
    <Route
      path="/inventario"
      element={
        <UserProvider>
          <Inventario />
        </UserProvider>
      }
    />
    <Route
      path="/inventario-impressoras"
      element={
        <UserProvider>
          <InventarioImpressoras />
        </UserProvider>
      }
    />
    <Route
      path="/pagina-principal-contratos"
      element={
        <UserProvider>
          <PaginaPrincipalContratos />
        </UserProvider>
      }
    />

    <Route
      path="/controle-contratos/:_id"
      element={
        <UserProvider>
          <ControleContratos />
        </UserProvider>
      }
    />

    <Route
      path="/cadastros-contratos"
      element={
        <UserProvider>
          <CadastrosContratos />
        </UserProvider>
      }
    />

    <Route
      path="/contas-office"
      element={
        <UserProvider>
          <ContasOffice />
        </UserProvider>
      }
    />

    <Route
      path="/to-do"
      element={
        <UserProvider>
          <ToDo />
        </UserProvider>
      }
    />

    <Route
      path="/users-ad"
      element={
        <UserProvider>
          <UsersAd />
        </UserProvider>
      }
    />
  </Routes>
);

export default Rotas;
