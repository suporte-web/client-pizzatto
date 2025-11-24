import {
  alpha,
  Box,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  type ContainerProps,
} from "@mui/material";
import SidebarNew from "../../../components/Sidebar";
import { ArrowRightAltOutlined, FilterList, Search } from "@mui/icons-material";
import moment from "moment";
import { useToast } from "../../../components/Toast";
import { useEffect, useState } from "react";
import { ContratosService } from "../../../stores/contrato/serviceContratos";
import ModalCriarContrato from "./components/ModalCriarContrato";

const PaginaPrincipalContratos = () => {
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

  const [contratos, setContratos] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [status, setStatus] = useState("Todos");
  const [loading, setLoading] = useState(false);
  const [totalStatus, setTotalStatus] = useState({
    todos: 0,
    iniciado: 0,
    emNegociacao: 0,
    aguardandoAssinatura: 0,
    ativo: 0,
    cancelado: 0,
    expirado: 0,
  });

  const statusColors: any = {
    INICIADO: "info",
    "EM NEGOCIACAO": "warning",
    "AGUARDANDO ASSINATURA": "primary",
    ATIVO: "success",
    CANCELADO: "error",
    EXPIRADO: "error",
  };

  const statusList = [
    "Todos",
    "INICIADO",
    "EM NEGOCIACAO",
    "AGUARDANDO ASSINATURA",
    "ATIVO",
    "CANCELADO",
    "EXPIRADO",
  ];

  const getTabColor = (status: string) => {
    switch (status) {
      case "INICIADO":
        return theme.palette.info.main;
      case "EM NEGOCIACAO":
        return theme.palette.info.main;
      case "AGUARDANDO ASSINATURA":
        return theme.palette.info.main;
      case "ATIVO":
        return theme.palette.success.main;
      case "CANCELADO":
        return theme.palette.error.main;
      case "EXPIRADO":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await ContratosService.findByFilter({
        pesquisa,
        page,
        status: status === "Todos" ? "" : status,
        limit: rowsPerPage,
      });
      setContratos(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
      showToast("Erro ao buscar Contratos!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, status, page, rowsPerPage]);

  const fetchTotalStatus = async () => {
    try {
      const getTotalInventario = await ContratosService.findByFilter({});
      const getTotalIniciado = await ContratosService.findByFilter({
        status: "INICIADO",
      });
      const getTotalEmNegociacao = await ContratosService.findByFilter({
        status: "EM NEGOCIACAO",
      });
      const getTotalAguardandoAssinatura = await ContratosService.findByFilter({
        status: "AGUARDANDO ASSINATURA",
      });
      const getTotalAtivo = await ContratosService.findByFilter({
        status: "ATIVO",
      });
      const getTotalCancelado = await ContratosService.findByFilter({
        status: "CANCELADO",
      });
      const getTotalExpirado = await ContratosService.findByFilter({
        status: "EXPIRADO",
      });

      setTotalStatus({
        todos: getTotalInventario.total || getTotalInventario.length || 0,
        iniciado: getTotalIniciado.total || getTotalIniciado.length || 0,
        emNegociacao:
          getTotalEmNegociacao.total || getTotalEmNegociacao.length || 0,
        aguardandoAssinatura:
          getTotalAguardandoAssinatura.total ||
          getTotalAguardandoAssinatura.length ||
          0,
        ativo: getTotalAtivo.total || getTotalAtivo.length || 0,
        cancelado: getTotalCancelado.total || getTotalCancelado.length || 0,
        expirado: getTotalExpirado.total || getTotalExpirado.length || 0,
      });
    } catch (error) {
      console.log(error);
      showToast("Erro ao carregar totais", "error");
    }
  };

  useEffect(() => {
    fetchTotalStatus();
  }, [flushHook]);

  const statusMapping: { [key: string]: keyof typeof totalStatus } = {
    Todos: "todos",
    INICIADO: "iniciado",
    "EM NEGOCIACAO": "emNegociacao",
    "AGUARDANDO ASSINATURA": "aguardandoAssinatura",
    ATIVO: "ativo",
    CANCELADO: "cancelado",
    EXPIRADO: "expirado",
  };

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="Página Principal de Contratos">
      <Container {...containerProps}>
        {/* Tabs de Status */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={status}
            onChange={(_, newValue) => setStatus(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minHeight: 60,
                fontSize: "0.875rem",
                fontWeight: 500,
                textTransform: "none",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 0,
                  height: 3,
                  backgroundColor: "currentColor",
                  transition: "all 0.3s ease",
                  transform: "translateX(-50%)",
                },
                "&.Mui-selected": {
                  color: (tabProps: any) => getTabColor(tabProps.value),
                  "&::after": {
                    width: "80%",
                  },
                },
              },
            }}
          >
            {statusList.map((status) => {
              const statusKey = statusMapping[status];
              const count = totalStatus[statusKey] || 0;

              return (
                <Tab
                  key={status}
                  label={
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="inherit">
                        {status}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mt: 0.5 }}
                      >
                        {count}
                      </Typography>
                    </Box>
                  }
                  value={status}
                  sx={{
                    color: getTabColor(status),
                    minWidth: { xs: 120, md: 140 },
                    px: 2,
                  }}
                />
              );
            })}
          </Tabs>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.background.paper, 0.7),
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
              label="Buscar Contrato"
              fullWidth
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              InputProps={{
                style: { borderRadius: 12 },
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ minWidth: { xs: "100%", md: 300 }, flex: 1 }}
            />

            <ModalCriarContrato
              showToast={showToast}
              setFlushHook={setFlushHook}
            />
          </Box>
        </Paper>

        {/* Paginação superior */}
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
            sx={{ minWidth: 120, width: isMobile ? "100%" : "auto" }}
          >
            <InputLabel>Linhas por página</InputLabel>
            <Select
              label="Linhas por página"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              sx={{ borderRadius: 2, backgroundColor: "background.paper" }}
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
            background: alpha(theme.palette.background.paper, 0.6),
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
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  {[
                    { title: "Contrato", align: "left" },
                    { title: "Cliente/Fornecedor", align: "left" },
                    { title: "Data de Criação", align: "left" },
                    { title: "Data de Assinatura", align: "left" },
                    {
                      title: (
                        <Box sx={{ py: 2 }}>
                          <Typography sx={{ fontWeight: 700 }}>
                            Validade de Contrato
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            Tempo Restante Contrato (Dias)
                          </Typography>
                        </Box>
                      ),
                      align: "center",
                    },
                    { title: "Status", align: "center" },
                    { title: "Ações", align: "left" },
                  ].map((item: any) => (
                    <TableCell
                      key={item.title}
                      align={item.align}
                      sx={{ fontWeight: 700, py: 2 }}
                    >
                      {item.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {contratos.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      transition: "0.2s",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.03
                        ),
                      },
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : alpha(theme.palette.action.hover, 0.015),
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>{item.contrato}</TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={
                          item.cliente
                            ? item.cliente?.nome
                            : item.fornecedor?.nome
                        }
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      {item.dataCriacao &&
                        moment(item.dataCriacao).format("DD/MM/YYYY HH:mm")}
                    </TableCell>

                    <TableCell sx={{ py: 1.5, fontFamily: "monospace" }}>
                      {item.dataAssinatura &&
                        moment(item.dataAssinatura).format("DD/MM/YYYY HH:mm")}
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="body2">
                            {item.dataInicioFidelidade &&
                              moment(item.dataInicioFidelidade).format(
                                "DD/MM/YYYY"
                              )}
                          </Typography>
                          <Typography variant="body2">
                            {item.dataInicioFidelidade &&
                              item.dataFinalFidelidade &&
                              "-"}
                          </Typography>
                          <Typography variant="body2">
                            {item.dataFinalFidelidade &&
                              moment(item.dataFinalFidelidade).format(
                                "DD/MM/YYYY"
                              )}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {item.dataInicioFidelidade &&
                            item.dataFinalFidelidade &&
                            moment(item.dataFinalFidelidade)
                              .add(1, "days")
                              .diff(item.dataInicioFidelidade, "days")}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center" sx={{ py: 1.5 }}>
                      <Chip
                        color={statusColors[item.status]}
                        label={item.status || "Não definido"}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          minWidth: 120,
                          "& .MuiChip-label": { px: 1.5 },
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5 }}>
                      <Tooltip title="Informações sobre o Contrato">
                        <IconButton href={`/controle-contratos/${item._id}`}>
                          <ArrowRightAltOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {contratos.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Box
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        <FilterList
                          sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
                        />
                        <Typography variant="h6" gutterBottom>
                          Nenhum contrato encontrado
                        </Typography>
                        <Typography variant="body2">
                          Tente ajustar os filtros ou adicionar novos contratos.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Paginação inferior */}
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
                borderRadius: 2,
                fontWeight: 600,
              },
            }}
          />
        </Box>
      </Container>
    </SidebarNew>
  );
};

export default PaginaPrincipalContratos;
