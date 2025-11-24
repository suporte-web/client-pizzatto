import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import ModalAdicionarToDo from "./components/ModalAdicionarToDo";
import { ToDoService } from "../../stores/toDo/service";
import { useToast } from "../../components/Toast";
import moment from "moment";
import ModalEditarToDo from "./components/ModalEditarToD";

const ToDo = () => {
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [aFazeres, setAFazeres] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await ToDoService.findByFilter({
        pesquisa,
      });

      setAFazeres(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
      showToast("Erro ao encontrar Lista de A Fazeres!", "error");
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, page, rowsPerPage]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="A Fazer">
      <Container>
        <Box
          component={Paper}
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            p: 2,
            borderRadius: "10px",
            alignItems: "center",
          }}
        >
          <TextField
            type="text"
            label="Buscar A Fazer"
            size="small"
            fullWidth
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
            }}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
          <ModalAdicionarToDo
            setFlushHook={setFlushHook}
            showToast={showToast}
          />
        </Box>

        {/* Controles de Paginação Superior */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
          sx={{ mb: 3, mt: 3 }}
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

        <Table size="small" sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Prazo Limite</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aFazeres.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  Nenhum item encontrado na Lista A Fazer
                </TableCell>
              </TableRow>
            )}
            {aFazeres.map((item: any) => (
              <TableRow>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>
                  {item.prazoLimite
                    ? moment(item.prazoLimite).format("DD/MM/YYYY")
                    : "Indeterminado"}
                </TableCell>
                <TableCell>{item.responsavel}</TableCell>
                <TableCell>
                  <ModalEditarToDo item={item} showToast={showToast} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </SidebarNew>
  );
};

export default ToDo;
