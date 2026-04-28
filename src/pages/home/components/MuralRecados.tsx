import {
  Box,
  Checkbox,
  Divider,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useUser } from "../../../UserContext";
import { useEffect, useState } from "react";
import ModalCreateMural from "./componentsMural/ModalCreateMural";
import { MuralService } from "../../../stores/mural/service";
import { MuralLikeService } from "../../../stores/muralLike/service";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import ModalCreateComentarioMural from "./componentsMural/ModalCreateComentarioMural";
import { MuralComentarioService } from "../../../stores/muralComentario/service";

const MuralRecados = () => {
  const { user } = useUser();

  const [murais, setMurais] = useState<any[]>([]);
  const [flushHook, setFlushHook] = useState(false);

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  const hasRole = (roles: string[]) =>
    roles.some((role) => user?.roles?.includes(role));

  const fetchGetMural = async () => {
    try {
      const getMurais = await MuralService.getAllByFilial();

      const muraisComDados = await Promise.all(
        getMurais.map(async (mural: any) => {
          try {
            const [likes, comentarios] = await Promise.all([
              MuralLikeService.findByMural({ muralId: mural.id }),
              MuralComentarioService.findByMural({ muralId: mural.id }),
            ]);

            return {
              ...mural,
              likes: Array.isArray(likes) ? likes : [],
              comentarios: Array.isArray(comentarios) ? comentarios : [],
            };
          } catch (error) {
            console.log(`Erro ao buscar dados do mural ${mural.id}:`, error);

            return {
              ...mural,
              likes: [],
              comentarios: [],
            };
          }
        }),
      );

      setMurais(muraisComDados);
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

  const handleToggleLikeMural = async (item: any) => {
    try {
      const usuarioJaCurtiu = item.likes?.some(
        (like: any) => like.muralId === item.id && like.nome === user?.nome,
      );

      if (usuarioJaCurtiu) {
        return;
      }

      await MuralLikeService.create({
        muralId: item.id,
        codigo: user?.codigo,
        nome: user?.nome,
      });

      fetchGetMural();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComentarios = async (muralId: string) => {
    try {
      setLoadingComentarios(true);

      const response = await MuralComentarioService.findByMural({
        muralId,
      });

      setComentarios(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log(error);
      setComentarios([]);
    } finally {
      setLoadingComentarios(false);
    }
  };

  return (
    <>
      {hasRole(["ADMIN", "ENDOMARKETING"]) && (
        <ModalCreateMural setFlushHook={setFlushHook} />
      )}

      {murais.length >= 1 && (
        <>
          <Divider sx={{ mt: 2, mb: 1 }} />

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
              const totalLikes = item.likes?.length || 0;

              const totalComentario = item.comentarios?.length || 0;

              const usuarioJaCurtiu = item.likes?.some(
                (like: any) =>
                  like.muralId === item.id && like.nome === user?.name,
              );

              return (
                <Paper
                  key={item.id}
                  elevation={7}
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 420,
                    mx: "auto",
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
                        zIndex: 1,
                      }}
                    >
                      IMPORTANTE
                    </Box>
                  )}

                  {item.caminhoImagem && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%", // 🔥 controla o tamanho (igual preview)
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                          position: "relative",
                        }}
                      >
                        <Box
                          component="img"
                          src={`${import.meta.env.VITE_API_BACKEND_AD}/${item.caminhoImagem}`}
                          alt={item.titulo}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>
                    </Box>
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
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Tooltip title="Curtir Mural">
                            <Checkbox
                              icon={<FavoriteBorder />}
                              checked={!!usuarioJaCurtiu}
                              onChange={() => handleToggleLikeMural(item)}
                              checkedIcon={<Favorite />}
                            />
                          </Tooltip>
                          <Typography variant="body2" fontWeight={600}>
                            {totalLikes}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ModalCreateComentarioMural
                            muralId={item.id}
                            fetchComentarios={fetchComentarios}
                            comentarios={comentarios}
                            loadingComentarios={loadingComentarios}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {totalComentario}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Criado por: {item.departamentoCriador}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

export default MuralRecados;
