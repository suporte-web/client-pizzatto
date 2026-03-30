import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { PoliticasService } from "../../stores/politicas/service";
import ModalCreatePolitica from "./components/ModalCreatePolitica";
import { UserAdService } from "../../stores/adLdap/serviceUsersAd";
import GridPoliticas from "./components/GridPoliticas";

const Politicas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [flushHook, setFlushHook] = useState(false);

  const [pesquisa, setPesquisa] = useState("");

  const [politicas, setPoliticas] = useState([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const get = await PoliticasService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });
      setPoliticas(get.result);
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

  const fetchArea = async () => {
    try {
      const get = await UserAdService.getAllSetoresUsersAd();
      setDepartamentos(get ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArea();
  }, []);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew>
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
              label="Pesquisar"
              fullWidth
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
              }}
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <ModalCreatePolitica
              setFlushHook={setFlushHook}
              departamentos={departamentos}
            />
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

        <GridPoliticas
          politicas={politicas}
          setFlushHook={setFlushHook}
        />
      </Container>
    </SidebarNew>
  );
};

export default Politicas;
