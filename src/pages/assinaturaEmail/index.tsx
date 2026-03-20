import {
  Box,
  Card,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import ModalCreateAssinaturaEmail from "./components/ModalCreateAssinaturaEmail";
import { useEffect, useState } from "react";
import { AssinaturaEmailService } from "../../stores/assinaturaEmail/service";
import ModalReprovarAssinatura from "./components/ModalReprovarAssinatura";
import ModalAprovarAssinatura from "./components/ModalAprovarAssinatura";

const AssinaturaEmail = () => {
  const [pesquisa, setPesquisa] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);

  const [assinaturas, setAssinaturas] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await AssinaturaEmailService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });

      setAssinaturas(get.result ?? []);
      setTotalPages(get.total ?? 0);
    } catch (error) {
      console.log(error);
      setAssinaturas([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, page, rowsPerPage]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              mb: 1,
              color: "text.primary",
            }}
          >
            Assinaturas de E-mail
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Gerencie, visualize e pesquise as assinaturas cadastradas.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            borderRadius: "20px",
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                label="Procurar Assinatura de E-mail"
                fullWidth
                size="small"
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  style: { borderRadius: "12px" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.paper",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <ModalCreateAssinaturaEmail setFlushHook={setFlushHook} />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <FormControl
              size="small"
              disabled={loading}
              sx={{
                minWidth: 160,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <InputLabel>Linhas por página</InputLabel>
              <Select
                label="Linhas por página"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "background.paper",
                }}
              >
                {[10, 20, 30, 40, 50, 100].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Pagination
              count={totalPaginas}
              page={page}
              onChange={(_e, value) => setPage(value)}
              disabled={loading}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "10px",
                  fontWeight: 700,
                },
              }}
            />
          </Box>
        </Card>

        <Grid container spacing={3}>
          {loading ? (
            <Grid size={{ xs: 12, md: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 6,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <CircularProgress />
                  <Typography color="text.secondary">
                    Carregando assinaturas...
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ) : assinaturas.length > 0 ? (
            assinaturas.map((item: any) => (
              <Grid key={item.id} size={{ xs: 12, md: 12 }}>
                <Card
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ color: "text.primary" }}
                      >
                        {item.nome}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Assinatura de e-mail cadastrada
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <ModalReprovarAssinatura item={item} />
                      <ModalAprovarAssinatura item={item} />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box
                      component="img"
                      src={`${import.meta.env.VITE_API_BACKEND}/${item.caminhoImagem}`}
                      alt={item.nome}
                      sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12, md: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px dashed",
                  borderColor: "divider",
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  Nenhuma assinatura encontrada
                </Typography>

                <Typography color="text.secondary">
                  Tente ajustar a pesquisa ou criar uma nova assinatura.
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </SidebarNew>
  );
};

export default AssinaturaEmail;
