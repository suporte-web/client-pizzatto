import {
  Box,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Typography,
  Grid,
  type ContainerProps,
  Paper,
  alpha,
  Chip,
  IconButton,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import ModalCriarInventarioImpressoras from "./components/ModalCriarInventarioImpressoras";
import { useToast } from "../../components/Toast";
import { InventarioImpressorasService } from "../../stores/inventarioImpressoras/service";
import ModalEditarInventarioImpressoras from "./components/ModalEditarInventarioImpressoras";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

const InventarioImpressoras = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);
  const [inventarios, setInventarios] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await InventarioImpressorasService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });
      setInventarios(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
      showToast("Erro ao carregar inventário", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, page, rowsPerPage]);

  const handleRefresh = () => {
    setFlushHook(!flushHook);
    showToast("Dados atualizados", "success");
  };

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  // // Função para formatar MAC address
  // const formatMAC = (mac: string) => {
  //   if (!mac) return "-";
  //   return mac.replace(/(.{2})/g, '$1:').slice(0, -1);
  // };

  // Componente para exibir em cards no mobile
  const MobileCardView = ({ item }: any) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Chip
            label={item.filial}
            color="primary"
            variant="filled"
            sx={{
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          />
          <ModalEditarInventarioImpressoras
            item={item}
            showToast={showToast}
            setFlushHook={setFlushHook}
          />
        </Box>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Marca:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {item.marca || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Modelo:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {item.modelo || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              N° Série:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "monospace",
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                px: 1,
                borderRadius: "4px",
              }}
            >
              {item.numeroSerie || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              IP:
            </Typography>
            <Chip
              label={item.ip || "Sem IP"}
              size="small"
              variant="outlined"
              color={item.ip ? "success" : "default"}
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "monospace",
                borderRadius: "6px",
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              MAC LAN:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "monospace",
                fontSize: "0.75rem",
              }}
            >
              {item.macLan}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              MAC WLAN:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontFamily: "monospace",
                fontSize: "0.75rem",
              }}
            >
              {item.macWlan}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Local:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {item.localizacao || "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Etiqueta:
            </Typography>
            <Chip
              label={item.etiqueta || "Sem etiqueta"}
              size="small"
              variant={item.etiqueta ? "filled" : "outlined"}
              color={item.etiqueta ? "secondary" : "default"}
              sx={{
                borderRadius: "6px",
                fontWeight: 500,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SidebarNew title="Inventário de Impressora">
        <Container
          {...containerProps}
          sx={{
            py: 3,
            maxWidth: "100% !important",
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="primary"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                Inventário de Impressoras
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <ModalCriarInventarioImpressoras
                  showToast={showToast}
                  setFlushHook={setFlushHook}
                />
              </Box>
            </Box>
          </Box>

          {/* Filtros e Busca */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              background: alpha(theme.palette.background.paper, 0.6),
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                type="text"
                size="small"
                fullWidth
                label="Buscar Impressora"
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                }}
                InputProps={{
                  style: { borderRadius: "12px" },
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{
                  flex: 1,
                }}
              />
            </Box>
          </Paper>

          {/* Controles de Paginação */}
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
                  borderRadius: "8px",
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          {/* Loading */}
          {loading && (
            <LinearProgress
              sx={{
                mb: 2,
                borderRadius: "8px",
                height: 4,
              }}
            />
          )}

          {/* Visualização Mobile */}
          {isMobile ? (
            <Box>
              {inventarios.map((item: any) => (
                <MobileCardView key={item._id} item={item} />
              ))}

              {inventarios.length === 0 && !loading && (
                <Paper
                  sx={{
                    textAlign: "center",
                    p: 6,
                    borderRadius: "16px",
                    border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                  }}
                >
                  <FilterListIcon
                    sx={{
                      fontSize: 48,
                      mb: 2,
                      color: "text.secondary",
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Nenhuma impressora encontrada
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tente ajustar os filtros de busca ou adicionar novas
                    impressoras.
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : (
            /* Visualização Desktop */
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box sx={{ position: "relative" }}>
                {loading && (
                  <LinearProgress
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                    }}
                  />
                )}
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.04
                        ),
                        "& th": {
                          fontWeight: "bold",
                          py: 2,
                          borderBottom: `2px solid ${theme.palette.divider}`,
                        },
                      }}
                    >
                      <TableCell>Filial</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>Modelo</TableCell>
                      <TableCell>N° Série</TableCell>
                      <TableCell>IP</TableCell>
                      <TableCell>MAC LAN</TableCell>
                      <TableCell>MAC WLAN</TableCell>
                      <TableCell>Local</TableCell>
                      <TableCell>Etiqueta</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventarios.map((item: any, index: number) => (
                      <TableRow
                        key={item._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.02
                            ),
                          },
                          backgroundColor:
                            index % 2 === 0
                              ? "transparent"
                              : alpha(theme.palette.action.hover, 0.02),
                          "& td": {
                            py: 1.5,
                            borderBottom: `1px solid ${alpha(
                              theme.palette.divider,
                              0.1
                            )}`,
                          },
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={item.filial}
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ fontWeight: 600, borderRadius: "6px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.marca || "-"}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.modelo || "-"}
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.05
                              ),
                              px: 1,
                              borderRadius: "4px",
                              display: "inline-block",
                            }}
                          >
                            {item.numeroSerie || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.ip || "Sem IP"}
                            size="small"
                            variant={item.ip ? "filled" : "outlined"}
                            color={item.ip ? "success" : "default"}
                            sx={{
                              fontWeight: 500,
                              fontFamily: "monospace",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                        >
                          {item.macLan}
                        </TableCell>
                        <TableCell
                          sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                        >
                          {item.macWlan}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {item.localizacao || "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.etiqueta || "Sem etiqueta"}
                            size="small"
                            variant={item.etiqueta ? "filled" : "outlined"}
                            color={item.etiqueta ? "secondary" : "default"}
                            sx={{
                              borderRadius: "6px",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <ModalEditarInventarioImpressoras
                            item={item}
                            showToast={showToast}
                            setFlushHook={setFlushHook}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {inventarios.length === 0 && !loading && (
                      <TableRow>
                        <TableCell align="center" colSpan={10} sx={{ py: 6 }}>
                          <FilterListIcon
                            sx={{
                              fontSize: 48,
                              mb: 2,
                              color: "text.secondary",
                              opacity: 0.5,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom
                          >
                            Nenhuma impressora encontrada
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Tente ajustar os filtros de busca ou adicionar novas
                            impressoras.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          )}

          {/* Paginação Inferior */}
          {inventarios.length > 0 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
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
          )}
        </Container>
      </SidebarNew>
    </>
  );
};

export default InventarioImpressoras;
