import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Chip,
  Stack,
  Pagination,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import ModalCreatePaginaInstitucional from "./components/ModalCreatePaginaInstitucional";
import { PaginaInstitucionalService } from "../../stores/paginaInstitucional/service";
import moment from "moment";
import ModalVisualizarInfo from "./components/ModalVisualizarInfo";
import ModalEditarPaginaInstitucional from "./components/ModalEditarPaginaInstitucional";
import { useUser } from "../../UserContext";

const PaginaInstitucional = () => {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [pesquisa, setPesquisa] = useState("");
  const [paginas, setPaginas] = useState([]);

  const [flushHook, setFlushHook] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await PaginaInstitucionalService.findByFilter({
        pesquisa: pesquisa,
        page: page,
        limit: rowsPerPage,
      });

      setPaginas(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
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
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Páginas Institucionais
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie as informações institucionais cadastradas na plataforma.
            </Typography>
          </Box>

          <Box
            component={Paper}
            elevation={7}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              borderRadius: "10px",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Pesquisar Informações"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            {user.roles?.includes("ADMIN", "RH") && (
              <ModalCreatePaginaInstitucional setFlushHook={setFlushHook} />
            )}
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={isMobile ? "column" : "row"}
            gap={isMobile ? 2 : 0}
            sx={{ mb: 3 }}
          >
            <FormControl
              size="small"
              disabled={loading}
              sx={{
                minWidth: 120,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <InputLabel>Linhas por página</InputLabel>
              <Select
                label="Linhas por página"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "background.paper",
                }}
              >
                {[9, 18, 27, 36, 45, 90].map((option) => (
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
                  borderRadius: "8px",
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {paginas.length > 0 ? (
              paginas.map((pagina: any) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={pagina.id}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 2.5,
                      borderRadius: "12px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {pagina.titulo}
                        </Typography>
                        <Chip
                          label={pagina.status === true ? "ATIVO" : "INATIVO"}
                          color={pagina.status === true ? "success" : "error"}
                          size="small"
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {pagina.descricao}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Última atualização:{" "}
                        {moment(pagina.dataAtualizacao).format(
                          "DD/MM/YYYY HH:mm",
                        )}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      spacing={1}
                      mt={2}
                    >
                      <ModalVisualizarInfo pagina={pagina} />
                      {user.roles?.includes("ADMIN", "RH") && (
                        <ModalEditarPaginaInstitucional
                          pagina={pagina}
                          setFlushHook={setFlushHook}
                        />
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" mb={1}>
                    Nenhum resultado encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tente pesquisar com outro termo.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Stack>
      </Container>
    </SidebarNew>
  );
};

export default PaginaInstitucional;
