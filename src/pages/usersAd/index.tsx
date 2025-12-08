import {
  Box,
  Chip,
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
import ModalCriarUserAD from "./components/ModalCriarUserAD";
import { useToast } from "../../components/Toast";
import { UserAdService } from "../../stores/usersAd/service";
import ModalEditarUserAD from "./components/ModalEditarUserAD";

const UsersAd = () => {
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [pesquisa, setPesquisa] = useState("");
  const [usersAd, setUsersAd] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const get = await UserAdService.getAllUsersAd();
      const get = await UserAdService.getUsersAdByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });
      setUsersAd(get.data);
      setTotalPages(get.total);
      console.log(get);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pesquisa, page, rowsPerPage]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="Usuarios AD (Active Directory)">
      <Container>
        <Paper elevation={1} sx={{ borderRadius: "10px", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              label="Pesquisar Usuario no AD"
              fullWidth
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
              }}
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <ModalCriarUserAD showToast={showToast} />
          </Box>
        </Paper>

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
          />
        </Box>

        <Paper elevation={1} sx={{ borderRadius: "10px", mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersAd.map((item: any) => (
                <TableRow>
                  <TableCell>{item.cn}</TableCell>
                  <TableCell>{item.sAMAccountName}</TableCell>
                  <TableCell>{item.userPrincipalName}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        item.isDisabled === true ? "Desativada" : "Ativada"
                      }
                      color={item.isDisabled === true ? "error" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <ModalEditarUserAD item={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </SidebarNew>
  );
};

export default UsersAd;
