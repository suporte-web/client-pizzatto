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
import { useEffect, useState } from "react";
import ModalCreateMural from "./componentsMural/ModalCreateMural";
import { MuralService } from "../../../stores/mural/service";
import moment from "moment";

const MuralRecados = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const { user } = useUser();

  const [murais, setMurais] = useState([]);
  const [flushHook, setFlushHook] = useState(false);

  const fetchGetMural = async () => {
    try {
      const get = await MuralService.getAllByFilial();
      setMurais(get);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetMural();
  }, [flushHook]);

  useEffect(() => {
    const interval = setInterval(fetchGetMural, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container {...containerProps}>
      {user?.roles.includes("ADMIN", "ENDOMARKETING") && (
        <ModalCreateMural setFlushHook={setFlushHook} />
      )}
      {murais.length >= 1 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight={800}>
              Mural de Recados
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              pb: 4,
            }}
          >
            {murais.map((item: any) => {
              return (
                <Paper
                  key={item.id}
                  elevation={7}
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    border:
                      item.importante === false
                        ? "1px solid #e0e0e0"
                        : "3px solid #f62a14",
                    boxShadow:
                      item.importante === false
                        ? "0 4px 16px rgba(0,0,0,0.08)"
                        : "0 4px 16px rgba(0, 0, 0, 0.67)",
                    animation: item.importante
                      ? "pulse 1.5s ease-in-out infinite"
                      : "none",

                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.03)",
                      },
                      "100%": {
                        transform: "scale(1)",
                      },
                    },
                  }}
                >
                  {item.importante && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#f62a14",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      }}
                    >
                      IMPORTANTE
                    </Box>
                  )}
                  {item.caminhoImagem && (
                    <Box
                      component="img"
                      src={`${import.meta.env.VITE_API_BACKEND_AD}/${item.caminhoImagem}`}
                      alt={item.titulo}
                      sx={{
                        width: "100%",
                        maxHeight: 380,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}

                  <Box sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ mb: 2, color: orange[800] }}
                    >
                      {item.titulo}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        color: "#444",
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                    >
                      {item.mensagem}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong>Criado por:</strong> {item.criadoPor}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        <strong>Criado em:</strong>{" "}
                        {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </>
      )}
    </Container>
  );
};

export default MuralRecados;
