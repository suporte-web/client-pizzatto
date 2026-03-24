import { Container, type ContainerProps, Divider, alpha } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { blue, teal } from "@mui/material/colors";
import MuralRecados from "./components/MuralRecados";
import ModalCreateAssinaturaEmail from "../assinaturaEmail/components/componentsAprovacaoAssinaturas/ModalCreateAssinaturaEmail";
import { useCallback, useEffect, useState } from "react";
import { AssinaturaPadraoService } from "../../stores/assinaturaPadrao/services";

const Home = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };

  const [flushHook, setFlushHook] = useState(false);
  const [assinaturaPadrao, setAssinaturaPadrao] = useState({});

  const fetchDataAssinaturasPadrao = useCallback(async () => {
    try {
      const getAtual = await AssinaturaPadraoService.findAtual();

      setAssinaturaPadrao(getAtual);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchDataAssinaturasPadrao();
  }, [fetchDataAssinaturasPadrao, flushHook]);

  return (
    <Sidebar title="Tela Inicial">
      <Container
        {...containerProps}
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(
            teal[50],
            0.5,
          )} 0%, ${alpha(blue[50], 0.5)} 100%)`,
          minHeight: "100vh",
        }}
      >
        <ModalCreateAssinaturaEmail
          setFlushHook={setFlushHook}
          assinaturaPadrao={assinaturaPadrao}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <MuralRecados />
      </Container>
    </Sidebar>
  );
};

export default Home;
