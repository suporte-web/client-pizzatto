import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
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
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import ModalAdicionarToDo from "./components/ModalAdicionarToDo";
import { ToDoService } from "../../stores/toDo/service";
import { useToast } from "../../components/Toast";
import moment from "moment";
import ModalEditarToDo from "./components/ModalEditarToD";
import { UserContext } from "../../UserContext";

const ToDo = () => {
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);
  const [loading, setLoading] = useState(false);

  const [finalizado, setFinalizado] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [aFazeres, setAFazeres] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await ToDoService.findByFilter({
        pesquisa,
        page: page,
        limit: rowsPerPage,
        finalizado: finalizado,
        responsavel: user?.acessos?.administrador ? "" : user?.nome,
      });

      setAFazeres(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Lista de A Fazeres!", "error");
    } finally {
      // OBS: se quiser, aqui provavelmente deveria ser setLoading(false)
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, page, rowsPerPage, finalizado]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="A Fazer">
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header / Busca + botão */}
        <Box
          component={Paper}
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: 2,
            p: 2.5,
            borderRadius: "16px",
            alignItems: isMobile ? "stretch" : "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
          }}
        >
          <TextField
            type="text"
            label="Buscar A Fazer"
            placeholder="Digite um nome, descrição ou responsável..."
            size="small"
            fullWidth
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
            }}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: isMobile ? "flex-end" : "flex-start",
            }}
          >
            <ModalAdicionarToDo
              setFlushHook={setFlushHook}
              showToast={showToast}
            />
          </Box>
        </Box>

        {/* Tabs de status */}
        <Box
          component={Paper}
          elevation={2}
          sx={{
            mt: 1,
            borderRadius: "16px",
            p: 1,
            background: theme.palette.mode === "light" ? "#fafafa" : "background.paper",
          }}
        >
          <Tabs
            value={finalizado}
            onChange={(_, val) => setFinalizado(val)}
            centered
            TabIndicatorProps={{
              style: {
                height: 4,
                borderRadius: 4,
                backgroundColor: theme.palette.primary.main,
              },
            }}
            sx={{
              ".MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "999px",
                minHeight: "44px",
                mx: 0.5,
                px: 2,
                transition: "0.2s ease-in-out",
              },
              ".MuiTab-root.Mui-selected": {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.main + "14",
              },
              ".MuiTabs-flexContainer": {
                justifyContent: "center",
              },
            }}
          >
            <Tab label="Não Finalizado" value={false} />
            <Tab label="Finalizado" value={true} />
            <Tab label="Todos" value={""} />
          </Tabs>
        </Box>

        {/* Controles de Paginação Superior */}
        <Box
          component={Paper}
          elevation={1}
          sx={{
            mt: 2,
            mb: 1,
            p: 2,
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 3,
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
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              sx={{
                borderRadius: "999px",
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "flex-end",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Página {page} de {Math.max(totalPaginas, 1)}
            </Typography>
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
        </Box>

        {/* Tabela */}
        <Box
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  "& .MuiTableCell-head": {
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  },
                }}
              >
                <TableCell align="center">Finalizar</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Prazo Limite</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Data Finalização</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aFazeres.length === 0 && (
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={7}
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    Nenhum item encontrado na Lista A Fazer
                  </TableCell>
                </TableRow>
              )}
              {aFazeres.map((item: any) => (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "#fafafa"
                          : "background.default",
                    },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? theme.palette.grey[100]
                          : theme.palette.grey[800],
                    },
                    transition: "background-color 0.15s ease-in-out",
                  }}
                >
                  <TableCell align="center">
                    {user?.acessos?.administrador || user?.nome === item.responsavel}
                    <FormGroup
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        m: 0,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.finalizado}
                            onChange={async (e) => {
                              const novoValor = e.target.checked;

                              await ToDoService.update({
                                _id: item._id,
                                finalizado: novoValor,
                                dataFinalizado: novoValor
                                  ? moment().format("YYYY-MM-DD HH:mm")
                                  : null,
                              });

                              showToast(
                                "Item a Fazer alterado com sucesso",
                                "success"
                              );

                              setFlushHook((prev) => !prev);
                            }}
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />
                    </FormGroup>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" noWrap title={item.nome}>
                      {item.nome}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      title={item.descricao}
                      color="text.secondary"
                    >
                      {item.descricao}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.prazoLimite
                      ? moment(item.prazoLimite).format("DD/MM/YYYY")
                      : "Indeterminado"}
                  </TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell>
                    {item.dataFinalizado
                      ? moment(item.dataFinalizado).format(
                          "DD/MM/YYYY HH:mm"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <ModalEditarToDo item={item} showToast={showToast} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Container>
    </SidebarNew>
  );
};

export default ToDo;
