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
import ModalCriarFornecedores from "./components/ModalCriarFornecedores";
import { FornecedorService } from "../../../../../stores/contrato/serviceFornecedores";
import { useToast } from "../../../../../components/Toast";
import ModalEditarFornecedor from "./components/ModalEditarFornecedores";

const Fornecedores = () => {
  const theme = useTheme();
  const [flushHook, setFlushHook] = useState(false);
  const { showToast } = useToast();

  const [pesquisa, setPesquisa] = useState("");
  const [fornecedores, setFornecedores] = useState([]);

  const fetchData = async () => {
    try {
      const get = await FornecedorService.findByFilter({
        pesquisa,
      });
      setFornecedores(get.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pesquisa, flushHook]);

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
            label="Buscar Fornecedores"
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
          <ModalCriarFornecedores
            setFlushHook={setFlushHook}
            showToast={showToast}
          />
        </Box>
      </Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome do Fornecedor</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell>VIP</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fornecedores.map((item: any) => (
            <TableRow>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.cnpj}</TableCell>
              <TableCell>
                <Chip
                  label={item.ativo === true ? "Ativo" : "Inativo"}
                  color={item.ativo === true ? "success" : "error"}
                />
              </TableCell>
              <TableCell>
                {item.vip && <Chip label="VIP" color="success" />}
              </TableCell>
              <TableCell>
                <ModalEditarFornecedor
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

export default Fornecedores;
