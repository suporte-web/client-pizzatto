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
import { useEffect, useState, useCallback } from "react";
import { useToast } from "../../../../../components/Toast";
import ModalCriarValoresContrato from "./components/ModalCriarValoresContratos";
import { ValoresContratosService } from "../../../../../stores/contrato/serviceValoresContratos";
import ModalEditarValoresContrato from "./components/ModalEditarValoresContrato";

const ValoresDeContratos = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const [pesquisa, setPesquisa] = useState("");
  const [flushHook, setFlushHook] = useState(false);
  const [valoresDeContratos, setValoresDeContratos] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const get = await ValoresContratosService.findByFilter({ pesquisa });
      setValoresDeContratos(get.result);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar dados", "error");
    }
  }, [pesquisa, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData, flushHook]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(6px)",
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
            label="Buscar Clientes"
            fullWidth
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
              style: { borderRadius: 12 },
            }}
            sx={{
              minWidth: { xs: "100%", md: 300 },
              flex: 1,
            }}
          />

          <ModalCriarValoresContrato
            showToast={showToast}
            setFlushHook={setFlushHook}
          />
        </Box>
      </Paper>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Valor do Contrato</TableCell>
            <TableCell>Fases Utilizadas</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {valoresDeContratos.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell>{item.valorContrato}</TableCell>
              <TableCell>
                {item.fases?.map((fase: any, i: any) => (
                  <span key={i}>
                    {fase}
                    {i < item.fases.length - 1 ? " > " : ""}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                <Chip
                  label={item.ativo ? "Ativo" : "Inativo"}
                  color={item.ativo ? "success" : "error"}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <ModalEditarValoresContrato
                  item={item}
                  setFlushHook={setFlushHook}
                  showToast={showToast}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ValoresDeContratos;
