import {
  Box,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
  type ContainerProps,
  Chip,
  Paper,
  Typography,
  alpha,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
// import ModalCriarInventario from "./components/ModalCriarInventario";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GlpiService } from "../../stores/glpi/service";
import ModalGerarTermoCompromisso from "./components/ModalGerarTermoDeCompromisso";

const GLPI_FIELDS = {
  equipamento: 40,
  nomeComputador: 1,
  tag: 5,
  nomeColaborador: 7,
  setor: 10,
  localizacao: 15,
  so: 45,
  fabricante: 23,
  processador: 17,
  memoria: 111,
  status: 31,
  id: 2,
} as const;

const pick = (row: any, key: number) => {
  const v = row?.[key];
  // o GLPI às vezes devolve { name, id } em dropdowns dependendo do modo
  if (v && typeof v === "object")
    return v.name ?? v.completename ?? v.value ?? v;
  return v ?? "";
};

const normalizeGlpiRow = (row: any) => ({
  id: pick(row, GLPI_FIELDS.id),
  equipamento: pick(row, GLPI_FIELDS.equipamento),
  fabricante: pick(row, GLPI_FIELDS.fabricante),
  tag: pick(row, GLPI_FIELDS.tag),
  setor: pick(row, GLPI_FIELDS.setor),
  nomeComputador: pick(row, GLPI_FIELDS.nomeComputador),
  nomeColaborador: pick(row, GLPI_FIELDS.nomeColaborador),
  localizacao: pick(row, GLPI_FIELDS.localizacao),
  processador: pick(row, GLPI_FIELDS.processador),
  memoria: pick(row, GLPI_FIELDS.memoria),
  status: pick(row, GLPI_FIELDS.status),
  so: pick(row, GLPI_FIELDS.so),
  _raw: row, // opcional: mantém o original pra debug
});

const Inventario = () => {
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

  const [pesquisa, setPesquisa] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventarios, setInventarios] = useState<any[]>([]);

  // Função para obter a cor do Chip baseado no status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ATIVO":
        return "success";
      case "INATIVO":
        return "error";
      default:
        return "default";
    }
  };

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const get = await GlpiService.getComputadores({
        limit: rowsPerPage,
        page,
        filter: pesquisa,
      });
      const normalized = (get.data ?? []).map(normalizeGlpiRow);
      setInventarios(normalized);
      setTotal(get.total)
      setTotalPages(get.totalcount ?? get.total ?? 0);
    } catch (error) {
      showToast("Erro ao carregar inventário", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, [flushHook, pesquisa, page, rowsPerPage]);

  const handleRefresh = () => {
    setFlushHook(!flushHook);
    showToast("Dados atualizados", "success");
  };

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <>
      <SidebarNew title="Inventário">
        <Container
          {...containerProps}
          sx={{
            py: 3,
            maxWidth: "100% !important",
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Header com título e ações */}
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
                Gestão de Inventário - {total || '0'}
              </Typography>
              <Box display="flex" gap={2}>
                <Box
                  onClick={handleRefresh}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <RefreshIcon />
                </Box>
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
                flexWrap: "wrap",
              }}
            >
              <TextField
                size="small"
                label="Buscar por Nome de Computador"
                fullWidth
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
                  minWidth: { xs: "100%", md: 300 },
                  flex: 1,
                }}
              />
            </Box>
          </Paper>

          {/* Controles de Paginação Superior */}
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

          {/* Tabela */}
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Equipamento
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Patrimônio
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      TAG
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Setor
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Nome Computador
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Nome Colaborador
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Fabricante
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Processador
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Memória
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>SO</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventarios.map((item, index) => (
                    <TableRow
                      key={item.id}
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
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{item.equipamento}</TableCell>
                      {/* <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.patrimonio || "N/A"}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell> */}
                      <TableCell sx={{ py: 1.5 }}>{item.tag || "-"}</TableCell>
                      {/* <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.setor}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell> */}
                      <TableCell sx={{ py: 1.5, fontFamily: "monospace" }}>
                        {item.nomeComputador || "-"}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {item.nomeColaborador
                          ? item.nomeColaborador
                              .split("/")
                              .map((parte: any, index: any) => (
                                <span key={index}>
                                  {parte.trim()}
                                  <br />
                                </span>
                              ))
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {item.fabricante || "-"}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {item.processador}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {item.memoria
                          ? `${Math.floor(Number(item.memoria) / 1024)} GB`
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{item.so}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.status || "Não definido"}
                          color={getStatusColor(item.status)}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            minWidth: "120px",
                            "& .MuiChip-label": {
                              px: 1.5,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            g: 1,
                          }}
                        >
                          {/* <ModalEditarInventario
                            item={item}
                            showToast={showToast}
                            setFlushHook={setFlushHook}
                          /> */}
                          <ModalGerarTermoCompromisso
                            item={item}
                            flushHook={flushHook}
                            setFlushHook={setFlushHook}
                            showToast={showToast}
                          />
                          {/* <Tooltip title="Gerar Termo de Compromisso">
                            <IconButton
                              onClick={() => handleCreatePdfTermo(item._id)}
                              color="error"
                              size="small"
                              sx={{
                                "&:hover": {
                                  backgroundColor: "error.light",
                                  color: "error.contrastText",
                                },
                              }}
                            >
                              {loadingTermoId === item._id ? (
                                <CircularProgress color="error" size={17} />
                              ) : (
                                <PictureAsPdf fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {inventarios.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Box
                          sx={{ textAlign: "center", color: "text.secondary" }}
                        >
                          <FilterListIcon
                            sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            Nenhum item encontrado
                          </Typography>
                          <Typography variant="body2">
                            Tente ajustar os filtros ou adicionar novos itens ao
                            inventário.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Controles de Paginação Inferior */}
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
        </Container>
      </SidebarNew>
    </>
  );
};

export default Inventario;
