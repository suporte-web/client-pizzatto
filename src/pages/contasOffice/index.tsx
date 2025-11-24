import {
  Box,
  Chip,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
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
  type ContainerProps,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import ModalCriarContasOffice from "./components/ModalCriarContasOffice";
import { useContext, useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
import { ContaOfficeService } from "../../stores/contasOffice/service";
import ModalEditarContasOffice from "./components/ModalEditarContasOffice";
import { UserContext } from "../../UserContext";

const ContasOffice = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const { user } = useContext(UserContext);
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);
  const [pesquisa, setPesquisa] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);

  const [contasOffice, setContasOffice] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await ContaOfficeService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });

      setContasOffice(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Contas Office", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pesquisa, page, rowsPerPage, flushHook]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="Contas Office">
      <Container {...containerProps}>
        <Box
          component={Paper}
          elevation={1}
          sx={{
            display: "flex",
            borderRadius: "10px",
            justifyContent: "space-between",
            alignItems: 'center',
            p: 2,
            gap: 2,
          }}
        >
          <TextField
            label="Pesquisar Contas do Office"
            fullWidth
            size="small"
            onChange={(e) => {
              setPesquisa(e.target.value);
            }}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
          <ModalCriarContasOffice
            setFlushHook={setFlushHook}
            showToast={showToast}
          />
        </Box>

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

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Ativo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )}
            {contasOffice.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  Não foi encontrado Nenhuma Conta Office cadastrada
                </TableCell>
              </TableRow>
            )}
            {contasOffice.map((item: any) => (
              <TableRow>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {
                    <Chip
                      color={item.ativo === true ? "success" : "error"}
                      label={item.ativo === true ? "Ativo" : "Inativo"}
                    />
                  }
                </TableCell>
                <TableCell>
                  {user?.acessos?.administrador && (
                    <ModalEditarContasOffice
                      item={item}
                      setFlushHook={setFlushHook}
                      showToast={showToast}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </SidebarNew>
  );
};

export default ContasOffice;
