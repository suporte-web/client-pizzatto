import { Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
// import ModalCriarClientes from "./components/ModalCriarClientes";
import { useToast } from "../../../../../components/Toast";
import { FilialService } from "../../../../../stores/contrato/serviceFilial";
import ModalCriarFiliais from "./components/ModalCriarFiliais";
import ModalEditarFiliais from "./components/ModalEditarFiliais";
// import ModalEditarCliente from "./components/ModalEditarCliente";

const Filiais = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const [pesquisa, setPesquisa] = useState("");
  const [flushHook, setFlushHook] = useState(false);
  const [clientes, setClientes] = useState([]);

  const fetchData = async () => {
    try {
      const get = await FilialService.findByFilter({
        pesquisa: pesquisa,
      });
      setClientes(get.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa]);

  return (
    <>
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
            label="Buscar Filiais"
            fullWidth
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
            }}
            InputProps={{
              style: { borderRadius: "12px" },
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{
              minWidth: { xs: "100%", md: 300 },
              flex: 1,
            }}
          />
          <ModalCriarFiliais
            showToast={showToast}
            setFlushHook={setFlushHook}
          />
        </Box>
      </Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Filial</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell>VIP</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((item: any) => (
            <TableRow>
              <TableCell>{item.filial}</TableCell>
              <TableCell>{item.cnpj}</TableCell>
              <TableCell>
                {
                  <Chip
                    label={item.ativo === true ? "Ativo" : "Inativo"}
                    color={item.ativo === true ? "success" : "error"}
                  />
                }
              </TableCell>
              <TableCell>
                {item.vip && <Chip label="VIP" color="success" />}
              </TableCell>
              <TableCell>
                <ModalEditarFiliais
                  item={item}
                  showToast={showToast}
                  setFlushHook={setFlushHook}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Filiais;
