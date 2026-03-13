import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { OrganogramaService } from "../../stores/adLdap/serviceOrganograma";
import OrganogramaTree from "./components/OrganogramaTree";
import SidebarNew from "../../components/Sidebar";
import PanZoomContainer from "./components/PanZoomContainer";
import { PictureAsPdf } from "@mui/icons-material";

const Organograma = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrganograma, setLoadingOrganograma] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tipoBusca, setTipoBusca] = useState<
    "completo" | "colaborador" | "departamento"
  >("completo");
  const [valorBusca, setValorBusca] = useState("");

  async function carregarOrganogramaCompleto() {
    try {
      setLoading(true);
      setError(null);
      const resultado = await OrganogramaService.findOrganograma();
      setData(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarOrganogramaCompleto();
  }, []);

  const handleBuscar = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!valorBusca.trim()) {
        await carregarOrganogramaCompleto();
        return;
      }

      if (tipoBusca === "departamento") {
        const resultado = await OrganogramaService.findDepartamento(valorBusca);

        // departamento já deve retornar array
        setData(Array.isArray(resultado) ? resultado : []);
      } else {
        const resultado = await OrganogramaService.findColaborador(valorBusca);

        // colaborador geralmente retorna objeto único
        setData(resultado ? [resultado] : []);
      }
    } catch (err) {
      setData([]);
      setError(err instanceof Error ? err.message : "Erro ao realizar busca");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = async () => {
    setValorBusca("");
    await carregarOrganogramaCompleto();
  };

  const baixarPdf = async () => {
    setLoadingOrganograma(true);
    try {
      const { blob } = await OrganogramaService.gerarPdf(tipoBusca, valorBusca);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "Organograma.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingOrganograma(false);
    }
  };

  return (
    <SidebarNew>
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Organograma da Empresa
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Visualização hierárquica dos colaboradores e suas relações de
            liderança.
          </Typography>
        </Box> */}

        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 4,
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              select
              label="Tipo de busca"
              value={tipoBusca}
              onChange={(e) =>
                setTipoBusca(e.target.value as "colaborador" | "departamento")
              }
              size="small"
              sx={{ minWidth: 220 }}
              InputProps={{ style: { borderRadius: "10px" } }}
            >
              <MenuItem value="completo">Completo</MenuItem>
              <MenuItem value="colaborador">Colaborador</MenuItem>
              <MenuItem value="departamento">Departamento</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label={
                tipoBusca === "colaborador"
                  ? "Pesquisar colaborador"
                  : "Pesquisar departamento"
              }
              value={valorBusca}
              onChange={(e) => setValorBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBuscar();
                }
              }}
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />

            <Button
              variant="contained"
              onClick={handleBuscar}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Buscar
            </Button>

            <Button
              variant="outlined"
              onClick={handleLimpar}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Limpar
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={baixarPdf}
              disabled={loadingOrganograma || loading}
              sx={{ borderRadius: "10px", textTransform: "none", minWidth: 48 }}
            >
              {loadingOrganograma ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <PictureAsPdf />
              )}
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 4,
            overflow: "hidden",
            p: 0,
          }}
        >
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box p={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {!loading && !error && data.length === 0 && (
            <Box p={3}>
              <Alert severity="info">Nenhum colaborador encontrado.</Alert>
            </Box>
          )}

          {!loading && !error && data.length > 0 && (
            <PanZoomContainer>
              <OrganogramaTree nodes={data} />
            </PanZoomContainer>
          )}
        </Paper>
      </Box>
    </SidebarNew>
  );
};

export default Organograma;
