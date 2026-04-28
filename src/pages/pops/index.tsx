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
import { useUser } from "../../UserContext";

const POPs = () => {
  const { user } = useUser();
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
        departamento: user?.department || undefined,
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
        <Box sx={{ py: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(255,255,255,1))",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={isMobile ? "stretch" : "center"}
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  POPs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consulte, visualize e baixe os procedimentos operacionais.
                </Typography>
              </Box>

              <ModalCriarPop setFluskHook={setFluskHook} />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
            >
              <TextField
                size="small"
                fullWidth
                label="Buscar por nome da POP"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setPage(1);
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />

              <FormControl
                size="small"
                disabled={loading}
                sx={{ minWidth: isMobile ? "100%" : 190 }}
              >
                <InputLabel>Itens por página</InputLabel>
                <Select
                  label="Itens por página"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  {[12, 24, 36, 48].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={isMobile ? "stretch" : "center"}
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "Carregando POPs..."
                : `${totalPages} POP${totalPages === 1 ? "" : "s"} encontrado${
                    totalPages === 1 ? "" : "s"
                  }`}
            </Typography>

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
              <Grid size={{ xs: 12, md: 4 }} key={pop.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    // height: "100%",
                    // minHeight: 210,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      color="primary.main"
                      sx={{
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {pop.originalName || "Sem nome"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Documento POP
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      mb: 2,
                      borderRadius: 3,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tamanho:</strong>{" "}
                      {pop.size
                        ? `${(Number(pop.size) / 1024 / 1024).toFixed(2)} MB`
                        : "N/A"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <strong>Criado em:</strong>{" "}
                      {pop.createdAt
                        ? new Date(pop.createdAt).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Departamento:</strong>{" "}
                      {pop.departamento ? pop.departamento : "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewFile(pop)}
                      sx={{
                        borderRadius: 3,
                        flex: 1,
                        textTransform: "none",
                        fontWeight: 700,
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
                        borderRadius: 3,
                        flex: 1,
                        textTransform: "none",
                        fontWeight: 700,
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
              elevation={0}
              sx={{
                p: 5,
                mt: 3,
                textAlign: "center",
                borderRadius: 4,
                border: "1px dashed",
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Nenhuma POP encontrada
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {nome
                  ? "Tente buscar por outro nome ou limpe o filtro."
                  : "Ainda não há POPs cadastradas."}
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </SidebarNew>
  );
};

export default POPs;
