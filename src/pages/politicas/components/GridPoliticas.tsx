import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Stack,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  DescriptionOutlined,
  BusinessOutlined,
  PersonOutline,
  CategoryOutlined,
  FolderOpenOutlined,
} from "@mui/icons-material";
import ModalLiberarVisualizacao from "./ModalLiberarVisualizacao";
import ModalVisualizarAceites from "./ModalVisualizarAceites";

const GridPoliticas = ({ politicas, setFlushHook }: any) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {politicas?.map((item: any) => {
          const arquivoUrl = item.caminhoArquivo
            ? `${import.meta.env.VITE_API_BACKEND}/${item.caminhoArquivo}`.replace(
                /([^:]\/)\/+/g,
                "$1",
              )
            : "";

          return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
                  background: "#fff",
                  transition: "all 0.2s ease",
                  minHeight: 340,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
                    borderColor: "#dbe3ee",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1.5}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#eef2ff",
                          color: "#2563eb",
                          flexShrink: 0,
                        }}
                      >
                        <DescriptionOutlined fontSize="small" />
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 1.2,
                            wordBreak: "break-word",
                          }}
                        >
                          {item.nome || "Política sem nome"}
                        </Typography>

                        {!!item.descricao && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748b",
                              mt: 0.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.descricao}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {!!item.tipoPolitica && (
                      <Chip
                        label={item.tipoPolitica}
                        size="small"
                        sx={{
                          borderRadius: "10px",
                          fontWeight: 700,
                          bgcolor: "#fff7ed",
                          color: "#c2410c",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Stack>

                  <Divider />

                  <Stack spacing={1.1}>
                    {!!item.departamento && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <BusinessOutlined
                          sx={{ fontSize: 18, color: "#737373", mt: "2px" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            wordBreak: "break-word",
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            Departamento:
                          </Box>{" "}
                          {item.departamento}
                        </Typography>
                      </Stack>
                    )}

                    {!!item.responsavel && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <PersonOutline
                          sx={{ fontSize: 18, color: "#737373", mt: "2px" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            wordBreak: "break-word",
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            Responsável:
                          </Box>{" "}
                          {item.responsavel}
                        </Typography>
                      </Stack>
                    )}

                    {!!item.tipoPolitica && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CategoryOutlined
                          sx={{ fontSize: 18, color: "#737373", mt: "2px" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            wordBreak: "break-word",
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            Tipo:
                          </Box>{" "}
                          {item.tipoPolitica}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  {!!item.descricao && (
                    <Box
                      sx={{
                        mt: 0.5,
                        px: 1.5,
                        py: 1.4,
                        borderRadius: "16px",
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#334155",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: 66,
                        }}
                      >
                        {item.descricao}
                      </Typography>
                    </Box>
                  )}

                  <Stack spacing={1.2} sx={{ pt: 1 }}>
                    {item.caminhoArquivo ? (
                      <Tooltip title="Abrir documento">
                        <Button
                          fullWidth
                          variant="contained"
                          size="medium"
                          startIcon={<FolderOpenOutlined />}
                          href={arquivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            py: 1.1,
                            boxShadow: "none",
                            background:
                              "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            "&:hover": {
                              boxShadow: "0 6px 14px rgba(37, 99, 235, 0.22)",
                            },
                          }}
                        >
                          Ver documento
                        </Button>
                      </Tooltip>
                    ) : (
                      <Chip
                        label="Sem arquivo"
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "10px",
                          color: "text.secondary",
                        }}
                      />
                    )}

                    <ModalLiberarVisualizacao
                      item={item}
                      setFlushHook={setFlushHook}
                    />
                    <ModalVisualizarAceites item={item} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GridPoliticas;
