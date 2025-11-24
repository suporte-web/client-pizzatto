import {
  Container,
  Paper,
  type ContainerProps,
  Typography,
  Box,
  alpha,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../UserContext";
import Sidebar from "../../components/Sidebar";
import { blue, teal } from "@mui/material/colors";
import ChangePassword from "./components/ChangePassword";

const Home = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const { user } = useContext(UserContext);

  return (
    <Sidebar title="Tela Inicial">
      <Container
        {...containerProps}
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(
            teal[50],
            0.5
          )} 0%, ${alpha(blue[50], 0.5)} 100%)`,
          minHeight: "100vh",
        }}
      >
        {user?.primeiroAcesso && <ChangePassword />}
        {/* Header Section */}
        <Box
          component={Paper}
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, yellow 0%, #FF4D00 100%)`,
            color: "white",
            p: 4,
            borderRadius: 3,
            mb: 4,
            mt: 4,
            textAlign: "center",
            boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="600"
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          >
            Bem-vindo, {user?.nome}!
          </Typography>
        </Box>
      </Container>
    </Sidebar>
  );
};

export default Home;