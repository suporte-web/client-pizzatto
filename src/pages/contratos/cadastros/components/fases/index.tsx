import { Search } from "@mui/icons-material";
import {
  alpha,
  Box,
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
import { useToast } from "../../../../../components/Toast";
import ModalCriarFases from "./components/ModalCriarFases";
import { FaseService } from "../../../../../stores/contrato/serviceFases";
import ModalEditarFases from "./components/ModalEditarFases";

const Fases = () => {
  const theme = useTheme();
  const [flushHook, setFlushHook] = useState(false);
  const { showToast } = useToast();

  const [pesquisa, setPesquisa] = useState("");
  const [fases, setFases] = useState([]);

  const fetchData = async () => {
    try {
      const get = await FaseService.findByFilter({
        pesquisa,
      });
      setFases(get.result);
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
            label="Buscar Fases"
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
          <ModalCriarFases setFlushHook={setFlushHook} showToast={showToast} />
        </Box>
      </Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID Referencia</TableCell>
            <TableCell>Fase</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fases.map((item: any) => (
            <TableRow>
              <TableCell>{item._id}</TableCell>
              <TableCell>{item.fase}</TableCell>
              <TableCell>
                <ModalEditarFases
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

export default Fases;
