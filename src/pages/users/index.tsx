import {
  Box,
  CircularProgress,
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import ModalCriarUser from "./components/ModalCriarUser";
import { useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
import { UserService } from "../../stores/users/service";
import ModalEditarUser from "./components/ModalEditarUser";

const Users = () => {
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [users, setUsers] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const get = await UserService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });
      setUsers(get.result);
      setTotalPages(get.total);
    } catch (error) {
      console.error(error);
      showToast("Erro ao buscar Usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [flushHook, pesquisa, page, rowsPerPage]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  // Componente Card para visualização mobile
  const UserCard = ({ item }: { item: any }) => (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1rem", mb: 0.5 }}>
              {item.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
              {item.email}
            </Typography>
          </Box>
          <ModalEditarUser
            item={item}
            setFlushHook={setFlushHook}
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Status
            </Typography>
            <Chip 
              label={item.ativo ? "Ativo" : "Inativo"} 
              size="small"
              color={item.ativo ? "success" : "default"}
              variant={item.ativo ? "filled" : "outlined"}
            />
          </Box>
          
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Data Admissão
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                : "-"}
            </Typography>
          </Box>
        </Box>

        {/* Informações adicionais se disponíveis */}
        {item.administrador && (
          <Box sx={{ mt: 1 }}>
            <Chip 
              label="Administrador" 
              size="small" 
              color="warning"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <SidebarNew title="Usuários">
      <Container maxWidth="xl" sx={{ py: 3, pb: isMobile ? 8 : 3 }}>
        {/* Header com busca e botão */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            label="Buscar por Nome ou E-mail"
            variant="outlined"
            size="small"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "background.paper",
              },
            }}
          />
          <ModalCriarUser setFlushHook={setFlushHook} />
        </Box>

        {/* Controles de paginação */}
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
              width: isMobile ? "100%" : "auto"
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

        {/* Conteúdo - Tabela para desktop / Cards para mobile */}
        {isMobile ? (
          // Visualização Mobile com Cards
          <Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={40} />
                <Typography
                  variant="body2"
                  sx={{ mt: 2, ml: 2, color: "text.secondary" }}
                >
                  Carregando usuários...
                </Typography>
              </Box>
            ) : users.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: "12px" }}>
                <Typography variant="body1" color="text.secondary">
                  Nenhum usuário encontrado
                </Typography>
              </Paper>
            ) : (
              users.map((item: any) => (
                <UserCard key={item.id} item={item} />
              ))
            )}
          </Box>
        ) : (
          // Visualização Desktop com Tabela
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Nome
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    E-mail
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Ativo
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Data Admissão
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, color: "text.secondary" }}
                      >
                        Carregando usuários...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Nenhum usuário encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item: any) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:hover": { backgroundColor: "action.hover" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.ativo ? "Ativo" : "Inativo"} 
                          size="small"
                          color={item.ativo ? "success" : "default"}
                          variant={item.ativo ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <ModalEditarUser
                          item={item}
                          setFlushHook={setFlushHook}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Paginação inferior */}
        {!loading && users.length > 0 && (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            mt: 3,
            pb: isMobile ? 2 : 0
          }}>
            <Pagination
              count={totalPaginas}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </Container>
    </SidebarNew>
  );
};

export default Users;