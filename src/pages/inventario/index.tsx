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
  Tabs,
  Tab,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  alpha,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
import ModalCriarInventario from "./components/ModalCriarInventario";
import { InventarioService } from "../../stores/inventario/service";
import moment from "moment";
import ModalEditarInventario from "./components/ModalEditarInventario";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";

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
  const [equipamento, setEquipamento] = useState("");
  const [setor, setSetor] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [totalStatus, setTotalStatus] = useState({
    todos: 0,
    emUso: 0,
    emEstoque: 0,
    emManutencao: 0,
    descontinuado: 0,
    furtado: 0,
    foraDeOperacao: 0,
  });

  // Lista de status possíveis
  const statusList = [
    "Todos",
    "EM USO",
    "EM ESTOQUE",
    "EM MANUTENÇÃO",
    "DESCONTINUADO",
    "FURTADO",
    "FORA DE OPERAÇÃO",
  ];

  // Função para obter a cor do Chip baseado no status
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "EM USO":
        return "success";
      case "EM ESTOQUE":
        return "primary";
      case "EM MANUTENÇÃO":
        return "warning";
      case "DESCONTINUADO":
        return "error";
      case "FURTADO":
        return "error";
      case "FORA DE OPERAÇÃO":
        return "default";
      default:
        return "default";
    }
  };

  // Função para obter a variante do Chip
  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case "EM USO":
      case "EM ESTOQUE":
      case "EM MANUTENÇÃO":
      case "DESCONTINUADO":
        return "filled";
      default:
        return "outlined";
    }
  };

  // Função para obter cor da tab baseada no status
  const getTabColor = (status: string) => {
    switch (status) {
      case "EM USO":
        return theme.palette.success.main;
      case "EM ESTOQUE":
        return theme.palette.info.main;
      case "EM MANUTENÇÃO":
        return theme.palette.warning.main;
      case "DESCONTINUADO":
        return theme.palette.error.main;
      case "FURTADO":
        return theme.palette.error.dark;
      case "FORA DE OPERAÇÃO":
        return theme.palette.grey[600];
      default:
        return theme.palette.primary.main;
    }
  };

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const get = await InventarioService.findByFilter({
        pesquisa,
        equipamento: equipamento === "Todos" ? "" : equipamento,
        setor: setor === "Todos" ? "" : setor,
        status: selectedStatus === "Todos" ? "" : selectedStatus,
        page,
        limit: rowsPerPage,
      });
      setInventarios(get.result);
      setTotalPages(get.total);
    } catch (error) {
      showToast("Erro ao carregar inventário", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, [
    flushHook,
    equipamento,
    pesquisa,
    setor,
    selectedStatus,
    page,
    rowsPerPage,
  ]);

  const fetchTotalStatus = async () => {
    try {
      const getTotalInventario = await InventarioService.findByFilter({});
      const getTotalEmUso = await InventarioService.findByFilter({
        status: "EM USO",
      });
      const getTotalEmEstoque = await InventarioService.findByFilter({
        status: "EM ESTOQUE",
      });
      const getTotalEmManutencao = await InventarioService.findByFilter({
        status: "EM MANUTENÇÃO",
      });
      const getTotalDescontinuado = await InventarioService.findByFilter({
        status: "DESCONTINUADO",
      });
      const getTotalFurtado = await InventarioService.findByFilter({
        status: "FURTADO",
      });
      const getTotalForaDeOperacao = await InventarioService.findByFilter({
        status: "FORA DE OPERAÇÃO",
      });

      setTotalStatus({
        todos: getTotalInventario.total || getTotalInventario.length || 0,
        emUso: getTotalEmUso.total || getTotalEmUso.length || 0,
        emEstoque: getTotalEmEstoque.total || getTotalEmEstoque.length || 0,
        emManutencao:
          getTotalEmManutencao.total || getTotalEmManutencao.length || 0,
        descontinuado:
          getTotalDescontinuado.total || getTotalDescontinuado.length || 0,
        furtado: getTotalFurtado.total || getTotalFurtado.length || 0,
        foraDeOperacao:
          getTotalForaDeOperacao.total || getTotalForaDeOperacao.length || 0,
      });
    } catch (error) {
      console.log(error);
      showToast("Erro ao carregar totais", "error");
    }
  };

  const statusMapping: { [key: string]: keyof typeof totalStatus } = {
    Todos: "todos",
    "EM USO": "emUso",
    "EM ESTOQUE": "emEstoque",
    "EM MANUTENÇÃO": "emManutencao",
    DESCONTINUADO: "descontinuado",
    FURTADO: "furtado",
    "FORA DE OPERAÇÃO": "foraDeOperacao",
  };

  useEffect(() => {
    fetchTotalStatus();
  }, [flushHook]);

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
            px: { xs: 2, md: 3 }
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
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                Gestão de Inventário
              </Typography>
              <Box display="flex" gap={2}>
                <ModalCriarInventario
                  showToast={showToast}
                  setFlushHook={setFlushHook}
                />
                <Box
                  onClick={handleRefresh}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <RefreshIcon />
                </Box>
              </Box>
            </Box>

            {/* Cards de Resumo */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, md: 2.4 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalStatus.todos}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, md: 2.4 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    color: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalStatus.emUso}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Em Uso
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, md: 2.4 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    color: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalStatus.emEstoque}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Em Estoque
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, md: 2.4 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                    color: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalStatus.emManutencao}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Manutenção
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, md: 2.4 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                    color: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {totalStatus.descontinuado + totalStatus.furtado}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Inativos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs de Status */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 3, 
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={selectedStatus}
              onChange={(_, newValue) => setSelectedStatus(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 60,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 0,
                    height: 3,
                    backgroundColor: 'currentColor',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&.Mui-selected': {
                    color: (tabProps: any) => getTabColor(tabProps.value),
                    '&::after': {
                      width: '80%',
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
                      <Box sx={{ textAlign: 'center' }}>
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

          {/* Filtros e Busca */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              background: alpha(theme.palette.background.paper, 0.6),
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                label="Buscar Inventário"
                fullWidth
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                }}
                InputProps={{ 
                  style: { borderRadius: "12px" },
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ 
                  minWidth: { xs: '100%', md: 300 },
                  flex: 1 
                }}
              />
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: { xs: '100%', md: 200 },
                  flex: 1 
                }}
              >
                <InputLabel>Equipamento</InputLabel>
                <Select
                  label="Equipamento"
                  value={equipamento}
                  onChange={(e) => setEquipamento(e.target.value)}
                  sx={{ borderRadius: "12px" }}
                >
                  {[
                    "Todos",
                    "DESKTOP",
                    "NOTEBOOK",
                    "MONITOR",
                    "HEADSET",
                    "MOUSE",
                    "TECLADO",
                    "TELEFONE CORPORATIVO",
                    "IMPRESSORA",
                    "SCANNER",
                    "TABLET",
                    "SERVIDOR",
                  ].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: { xs: '100%', md: 200 },
                  flex: 1 
                }}
              >
                <InputLabel>Setor</InputLabel>
                <Select
                  label="Setor"
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  sx={{ borderRadius: "12px" }}
                >
                  {[
                    "Todos",
                    "CCO",
                    "TI",
                    "COMPRAS",
                    "CONTRATOS",
                    "FINANCEIRO",
                    "RH",
                    "DP",
                    "CONTROLADORIA",
                    "SEGURANÇA DO TRABALHO",
                    "QUALIDADE",
                    "COMERCIAL",
                    "FISCAL",
                    "GERENCIA",
                    "DIRETORIA",
                    "SUBCONTRATADOS",
                    "MANUTENÇÃO",
                  ].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                  fontWeight: 600,
                }
              }}
            />
          </Box>

          {/* Tabela */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              mb: 3
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {loading && (
                <LinearProgress 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0,
                    height: 2 
                  }} 
                />
              )}
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Equipamento</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Patrimônio</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>TAG</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Setor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Nome Computador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Nome Colaborador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Localização</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Data de Entrega</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventarios.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        },
                        backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.action.hover, 0.02)
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{item.equipamento}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.patrimonio || "N/A"}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{item.tag || "-"}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.setor}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontFamily: 'monospace' }}>
                        {item.nomeComputador || "-"}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{item.nomeColaborador || "-"}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{item.localizacao || "-"}</TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        {item.dataEntrega
                          ? moment(item.dataEntrega).format("DD/MM/YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={item.status || "Não definido"}
                          color={getStatusColor(item.status)}
                          variant={getStatusVariant(item.status)}
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
                        <ModalEditarInventario
                          item={item}
                          showToast={showToast}
                          setFlushHook={setFlushHook}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {inventarios.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          <FilterListIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                          <Typography variant="h6" gutterBottom>
                            Nenhum item encontrado
                          </Typography>
                          <Typography variant="body2">
                            Tente ajustar os filtros ou adicionar novos itens ao inventário.
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
          <Box
            display="flex"
            justifyContent="center"
            sx={{ mt: 3 }}
          >
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
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                  fontWeight: 600,
                }
              }}
            />
          </Box>
        </Container>
      </SidebarNew>
    </>
  );
};

export default Inventario;