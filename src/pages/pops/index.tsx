import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Pagination,
  Paper,
  Select,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import ModalCriarPop from "./components/ModalCriarPop";
import { useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
import { PopsService } from "../../stores/pops/service";
import { Visibility, Download } from "@mui/icons-material";

const POPs = () => {
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [nome, setNome] = useState("");
  const [pops, setPops] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [flushHook, setFluskHook] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);
      const get = await PopsService.findByFilter({
        nome,
        page,
        limit: rowsPerPage,
      });

      setPops(get.result || []);
      setTotalPages(get.total || 0);
    } catch (error) {
      console.log("Erro na requisição:", error);
      showToast("Erro ao mostrar POPs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = (pop: any) => {
    // Verifica se é arquivo Word e usa a conversão para PDF
    const isWordFile =
      pop.mimetype?.includes("word") ||
      pop.originalName?.match(/\.docx?$/i) ||
      pop.filename?.match(/\.docx?$/i);

    if (isWordFile) {
      // Usa o endpoint de conversão para PDF
      const pdfUrl = `${import.meta.env.VITE_API_BACKEND}/files/view-pdf/${
        pop.folder
      }/${pop.filename}`;
      window.open(pdfUrl, "_blank");
    } else {
      // Para outros arquivos (PDF, imagens, etc.)
      const fileUrl = `${import.meta.env.VITE_API_BACKEND}/files/view/${
        pop.folder
      }/${pop.filename}`;
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownloadFile = (pop: any) => {
    const downloadUrl = `${import.meta.env.VITE_API_BACKEND}/files/download/${
      pop.filename
    }?folder=${pop.folder}`;
    window.open(downloadUrl, "_blank");
  };

  useEffect(() => {
    handleFetch();
  }, [flushHook, nome, page, rowsPerPage]);

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <SidebarNew title="Controle de POPs">
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <TextField
            size="small"
            fullWidth
            type="text"
            label="Buscar por Nome da POP"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
          <ModalCriarPop setFluskHook={setFluskHook} />
        </Box>

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
              {[12, 24, 36, 48].map((option) => (
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
        <Grid container spacing={2}>
          {pops.map((pop: any) => (
            <Grid size={{ xs: 6, md: 3 }} key={pop._id}>
              <Paper
                elevation={5}
                sx={{
                  borderRadius: "10px",
                  p: 2,
                  height: "85%",
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-between", // Isso garante que o conteúdo ocupe toda a altura
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    {pop.originalName || "Sem nome"}
                  </Typography>

                  <Box>
                    <Box sx={{ mb: 1 }}>
                      <strong>Tamanho:</strong>{" "}
                      {pop.size
                        ? `${(pop.size / 1024 / 1024).toFixed(2)} MB`
                        : "N/A"}
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <strong>Data:</strong>{" "}
                      {pop.createdAt
                        ? new Date(pop.createdAt).toLocaleDateString()
                        : "N/A"}
                    </Box>
                  </Box>
                </Box>

                {/* Box dos botões agora fica no bottom */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto", // Isso empurra os botões para o bottom
                    pt: 2, // Padding top para separar do conteúdo acima
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewFile(pop)}
                    sx={{
                      borderRadius: "8px",
                      flex: 1,
                    }}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => handleDownloadFile(pop)}
                    sx={{
                      borderRadius: "8px",
                      flex: 1,
                    }}
                  >
                    Baixar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {pops.length === 0 && !loading && (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "grey.50",
              mt: 2,
            }}
          >
            <Box sx={{ color: "text.secondary" }}>
              {nome
                ? "Nenhum POP encontrado para esta busca"
                : "Nenhum POP cadastrado"}
            </Box>
          </Paper>
        )}
      </Container>
    </SidebarNew>
  );
};

export default POPs;
