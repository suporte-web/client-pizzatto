import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  type ContainerProps,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useUser } from "../../../UserContext";
import { useEffect } from "react";
import ModalCreateMural from "./componentsMural/ModalCreateMural";

const MuralRecados = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
    color: orange[300],
  };

  const { user } = useUser();

  console.log(user);

  const fetchGetMural = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetMural();
  }, []);

  return (
    <>
      <Container {...containerProps}>
        <ModalCreateMural />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight={800}>
            Mural de Recados
          </Typography>
        </Box>
        <Box
          component={Paper}
          elevation={7}
          sx={{ p: 1, borderRadius: "10px" }}
        >
          <Typography variant="h6" fontWeight={800}>
            Nome da Filial
          </Typography>
          <Divider />
          <Typography>Criado Por</Typography>
          <Divider />
          <Typography>Criado Em</Typography>
          <Box>{}</Box>
        </Box>
      </Container>
    </>
  );
};

export default MuralRecados;
