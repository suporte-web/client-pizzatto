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
import PlantaoPagePrincipal from "./pages/plantaoTi";
import Organograma from "./pages/organograma";
import CalendarioInstitucional from "./pages/calendarioInstitucional";
import AssinaturaEmail from "./pages/assinaturaEmail";
import PlantaoAdmin from "./pages/plantaoAdmin";
import Politicas from "./pages/politicas";
import Holerites from "./pages/holerites";
import PaginaInstitucional from "./pages/paginaInstitucional";
import BibliotecaMarca from "./pages/bibliotecaMarca";

const Rotas = () => (
  <Routes>
    <Route path="/" index element={<Login />} />
    <Route path="/plantao/page-principal" element={<PlantaoPagePrincipal />} />
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

    <Route
      path="/organograma"
      element={
        <UserProvider>
          <Organograma />
        </UserProvider>
      }
    />

    <Route
      path="/calendario-institucional"
      element={
        <UserProvider>
          <CalendarioInstitucional />
        </UserProvider>
      }
    />
    <Route
      path="/assinatura-email"
      element={
        <UserProvider>
          <AssinaturaEmail />
        </UserProvider>
      }
    />
    <Route
      path="/plantao"
      element={
        <UserProvider>
          <PlantaoAdmin />
        </UserProvider>
      }
    />
    <Route
      path="/politicas"
      element={
        <UserProvider>
          <Politicas />
        </UserProvider>
      }
    />
    <Route
      path="/holerites"
      element={
        <UserProvider>
          <Holerites />
        </UserProvider>
      }
    />
    <Route
      path="/pagina-institucional"
      element={
        <UserProvider>
          <PaginaInstitucional />
        </UserProvider>
      }
    />
    {/* <Route
      path="/valores-comportamentos"
      element={
        <UserProvider>
          <Holerites />
        </UserProvider>
      }
    /> */}
    <Route
      path="/biblioteca-marca"
      element={
        <UserProvider>
          <BibliotecaMarca />
        </UserProvider>
      }
    />
    {/* <Route
      path="/templates-institucionais"
      element={
        <UserProvider>
          <Holerites />
        </UserProvider>
      }
    /> */}
    {/* <Route
      path="/diretrizes-linguagens"
      element={
        <UserProvider>
          <Holerites />
        </UserProvider>
      }
    /> */}
  </Routes>
);

export default Rotas;
