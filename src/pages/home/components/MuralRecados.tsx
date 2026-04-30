import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useUser } from "../../../UserContext";
import { useEffect, useMemo, useState } from "react";
import ModalCreateMural from "./componentsMural/ModalCreateMural";
import { MuralService } from "../../../stores/mural/service";
import { MuralLikeService } from "../../../stores/muralLike/service";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import ModalCreateComentarioMural from "./componentsMural/ModalCreateComentarioMural";
import { MuralComentarioService } from "../../../stores/muralComentario/service";
import ModalDeleteMural from "./componentsMural/ModalDeleteMural";

const MuralRecados = () => {
  const { user } = useUser();

  const [murais, setMurais] = useState<any[]>([]);
  const [flushHook, setFlushHook] = useState(false);

  const [muralAtualIndex, setMuralAtualIndex] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);

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

  const ultimosMurais = useMemo(() => {
    return [...murais]
      .sort((a, b) => {
        const dataA = new Date(
          a.createdAt || a.dataCriacao || a.criadoEm || 0,
        ).getTime();

        const dataB = new Date(
          b.createdAt || b.dataCriacao || b.criadoEm || 0,
        ).getTime();

        return dataB - dataA;
      })
      .slice(0, 5);
  }, [murais]);

  const muralAtual = ultimosMurais[muralAtualIndex];

  useEffect(() => {
    fetchGetMural();
  }, [flushHook]);

  useEffect(() => {
    if (modalAberto) return; // 🔥 NÃO ATUALIZA SE MODAL ABERTO

    const interval = setInterval(fetchGetMural, 60000);

    return () => clearInterval(interval);
  }, [modalAberto]);

  useEffect(() => {
    if (modalAberto || ultimosMurais.length <= 1) return;

    const interval = setInterval(() => {
      setMuralAtualIndex((prev) =>
        prev === ultimosMurais.length - 1 ? 0 : prev + 1,
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [ultimosMurais.length, modalAberto]);

  const handleProximoMural = () => {
    setMuralAtualIndex((prev) =>
      prev === ultimosMurais.length - 1 ? 0 : prev + 1,
    );
  };

  const handleMuralAnterior = () => {
    setMuralAtualIndex((prev) =>
      prev === 0 ? ultimosMurais.length - 1 : prev - 1,
    );
  };

  const handleToggleLikeMural = async (item: any) => {
    try {
      const usuarioJaCurtiu = muralAtual?.likes?.some(
        (like: any) =>
          like.muralId === muralAtual.id && like.nome === user?.name,
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

      const comentariosAtualizados = Array.isArray(response) ? response : [];

      setComentarios(comentariosAtualizados);

      setMurais((prevMurais) =>
        prevMurais.map((mural) =>
          mural.id === muralId
            ? {
                ...mural,
                comentarios: comentariosAtualizados,
              }
            : mural,
        ),
      );
    } catch (error) {
      console.log(error);
      setComentarios([]);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const totalLikes = muralAtual?.likes?.length || 0;
  const totalComentario = muralAtual?.comentarios?.length || 0;

  const usuarioJaCurtiu = muralAtual?.likes?.some(
    (like: any) => like.muralId === muralAtual.id && like.nome === user?.name,
  );
  
  return (
    <>
      {hasRole(["ADMIN", "ENDOMARKETING", "RH"]) && (
        <ModalCreateMural setFlushHook={setFlushHook} />
      )}

      {ultimosMurais.length >= 1 && muralAtual && (
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
              position: "relative",
              width: "100%",
              maxWidth: 520,
              mx: "auto",
              pb: 1,
            }}
          >
            {ultimosMurais.length > 1 && (
              <>
                <IconButton
                  onClick={handleMuralAnterior}
                  sx={{
                    position: "absolute",
                    left: { xs: 8, sm: -56 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    boxShadow: 3,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ArrowBackIosNew />
                </IconButton>

                <IconButton
                  onClick={handleProximoMural}
                  sx={{
                    position: "absolute",
                    right: { xs: 8, sm: -56 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    boxShadow: 3,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}

            <Paper
              key={muralAtual.id}
              elevation={7}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                mx: "auto",
                borderRadius: "16px",
                overflow: "hidden",
                border:
                  muralAtual.importante === false
                    ? "1px solid #e0e0e0"
                    : "3px solid #f62a14",
                boxShadow:
                  muralAtual.importante === false
                    ? "0 4px 16px rgba(0,0,0,0.08)"
                    : "0 4px 16px rgba(0, 0, 0, 0.67)",
                animation: muralAtual.importante
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
              {muralAtual.importante && (
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

              {user?.department === muralAtual.departamentoCriador && (
                <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
                  <ModalDeleteMural
                    muralId={muralAtual.id}
                    setFlushHook={setFlushHook}
                  />
                </Box>
              )}

              {muralAtual.caminhoImagem && (
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
                      width: "100%",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={`${import.meta.env.VITE_API_BACKEND_AD}/${muralAtual.caminhoImagem}`}
                      alt={muralAtual.titulo}
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
                  {muralAtual.titulo}
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
                  {muralAtual.mensagem}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Tooltip title="Curtir Mural">
                        <Checkbox
                          icon={<FavoriteBorder />}
                          checked={!!usuarioJaCurtiu}
                          onChange={() => handleToggleLikeMural(muralAtual)}
                          checkedIcon={<Favorite />}
                        />
                      </Tooltip>

                      <Typography variant="body2" fontWeight={600}>
                        {totalLikes}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ModalCreateComentarioMural
                        muralId={muralAtual.id}
                        mural={muralAtual}
                        fetchComentarios={fetchComentarios}
                        comentarios={comentarios}
                        loadingComentarios={loadingComentarios}
                        setModalAberto={setModalAberto}
                      />

                      <Typography variant="body2" fontWeight={600}>
                        {totalComentario}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Criado por: {muralAtual.departamentoCriador}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {ultimosMurais.length > 1 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 1.5,
                  fontWeight: 600,
                }}
              >
                {muralAtualIndex + 1} / {ultimosMurais.length}
              </Typography>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default MuralRecados;
