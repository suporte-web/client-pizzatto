import {
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalCreateAssinaturaPadrao from "./componentsAssinaturaPadrao/ModalCreateAssinaturaPadrao";
import pizzattoImage from "../../../imgs/PizzattoLog_logo.png";

type PositionValue = number | string | null | undefined;

type AssinaturaPadrao = {
  id: string;
  nome?: string | null;
  caminhoBackground?: string | null;
  corFont?: string | null;
  fontSize?: string | number | null;

  photoX?: PositionValue;
  photoY?: PositionValue;
  photoSize?: PositionValue;

  nomeX?: PositionValue;
  nomeY?: PositionValue;

  departamentoX?: PositionValue;
  departamentoY?: PositionValue;

  telefoneX?: PositionValue;
  telefoneY?: PositionValue;

  logoX?: PositionValue;
  logoY?: PositionValue;
  logoHeight?: PositionValue;

  isAtual?: boolean;
};

type Props = {
  assinaturas: AssinaturaPadrao[];
  totalPages: number;
  page: number;
  setPage: (value: number) => void;
  loading: boolean;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  setFlushHook: (value: boolean) => void;
};

const SIGNATURE_WIDTH = 520;
const SIGNATURE_HEIGHT = 220;

const toNumber = (value: PositionValue): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(
    String(value).replace("%", "").replace("px", "").trim(),
  );

  return Number.isNaN(parsed) ? null : parsed;
};

const hasPercentUnit = (value: PositionValue) =>
  typeof value === "string" && value.trim().endsWith("%");

const renderIfPositioned = (...values: PositionValue[]) =>
  values.every(
    (value) => value !== null && value !== undefined && value !== "",
  );

const PreviewAssinatura = ({ item }: { item: AssinaturaPadrao }) => {
  const corFonte = item.corFont || "#000000";
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [renderSize, setRenderSize] = useState({ width: 1, height: 1 });

  const fontSizeBaseRaw = toNumber(item.fontSize) ?? 16;
  const fontSizeSecundariaRaw = Math.max(fontSizeBaseRaw - 2, 10);

  useEffect(() => {
    const updateSize = () => {
      if (!imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();

      setRenderSize({
        width: rect.width || 1,
        height: rect.height || 1,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [item.caminhoBackground]);

  const scaleX = useMemo(
    () => renderSize.width / SIGNATURE_WIDTH || 1,
    [renderSize.width],
  );

  const scaleY = useMemo(
    () => renderSize.height / SIGNATURE_HEIGHT || 1,
    [renderSize.height],
  );

  const posX = (value: PositionValue) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (hasPercentUnit(value)) return value as string;

    const num = toNumber(value);
    if (num === null) return undefined;

    return `${num * scaleX}px`;
  };

  const posY = (value: PositionValue) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (hasPercentUnit(value)) return value as string;

    const num = toNumber(value);
    if (num === null) return undefined;

    return `${num * scaleY}px`;
  };

  const sizeByX = (value: PositionValue) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (hasPercentUnit(value)) return value as string;

    const num = toNumber(value);
    if (num === null) return undefined;

    return `${num * scaleX}px`;
  };

  const sizeByY = (value: PositionValue) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (hasPercentUnit(value)) return value as string;

    const num = toNumber(value);
    if (num === null) return undefined;

    return `${num * scaleY}px`;
  };

  const fontSizeBase = `${fontSizeBaseRaw * scaleX}px`;
  const fontSizeSecundaria = `${fontSizeSecundariaRaw * scaleX}px`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        ref={imgRef}
        src={`${import.meta.env.VITE_API_BACKEND}/${item.caminhoBackground}`}
        alt={item.nome || "Assinatura"}
        onLoad={(e) => {
          const target = e.currentTarget;
          const rect = target.getBoundingClientRect();

          setRenderSize({
            width: rect.width || 1,
            height: rect.height || 1,
          });
        }}
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          backgroundColor: "#fff",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {renderIfPositioned(item.photoX, item.photoY, item.photoSize) && (
        <Box
          component="img"
          src="/assets/user-placeholder.png"
          sx={{
            position: "absolute",
            left: posX(item.photoX),
            top: posY(item.photoY),
            width: sizeByX(item.photoSize),
            height: sizeByX(item.photoSize),
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            border: "3px solid rgba(201, 189, 189, 0.95)",
            backgroundColor: "transparent",
            zIndex: 3,
          }}
        />
      )}

      {renderIfPositioned(item.nomeX, item.nomeY) && (
        <Typography
          sx={{
            position: "absolute",
            left: posX(item.nomeX),
            top: posY(item.nomeY),
            color: corFonte,
            fontSize: fontSizeBase,
            fontWeight: 800,
            lineHeight: 1.15,
            textAlign: "left",
            maxWidth: "45%",
            wordBreak: "break-word",
          }}
        >
          Nome do Colaborador
        </Typography>
      )}

      {renderIfPositioned(item.departamentoX, item.departamentoY) && (
        <Typography
          sx={{
            position: "absolute",
            left: posX(item.departamentoX),
            top: posY(item.departamentoY),
            color: corFonte,
            fontSize: fontSizeSecundaria,
            fontWeight: 500,
            lineHeight: 1.15,
            textAlign: "left",
            maxWidth: "45%",
            wordBreak: "break-word",
          }}
        >
          Departamento
        </Typography>
      )}

      {renderIfPositioned(item.telefoneX, item.telefoneY) && (
        <Typography
          sx={{
            position: "absolute",
            left: posX(item.telefoneX),
            top: posY(item.telefoneY),
            color: corFonte,
            fontSize: fontSizeSecundaria,
            fontWeight: 500,
            lineHeight: 1.15,
            textAlign: "left",
            maxWidth: "45%",
            wordBreak: "break-word",
          }}
        >
          (11) 99999-9999
        </Typography>
      )}

      {renderIfPositioned(item.logoX, item.logoY, item.logoHeight) && (
        <Box
          component="img"
          src={pizzattoImage}
          alt="Logo"
          sx={{
            position: "absolute",
            left: posX(item.logoX),
            top: posY(item.logoY),
            height: sizeByY(item.logoHeight),
            width: "auto",
            maxWidth: "30%",
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  );
};

const TabAssinaturaPadrao = ({
  assinaturas,
  totalPages,
  page,
  setPage,
  loading,
  rowsPerPage,
  setRowsPerPage,
  setFlushHook,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const totalPaginas = Math.ceil(totalPages / rowsPerPage);

  return (
    <>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ mb: 1, color: "text.primary" }}
      >
        Ajustar Assinatura de E-mail
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Crie assinaturas pré-definidas.
      </Typography>

      <Card
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <ModalCreateAssinaturaPadrao setFlushHook={setFlushHook} />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <FormControl
            size="small"
            disabled={loading}
            sx={{
              minWidth: 160,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <InputLabel>Linhas por página</InputLabel>
            <Select
              label="Linhas por página"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
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
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "10px",
                fontWeight: 700,
              },
            }}
          />
        </Box>
      </Card>

      <Grid container spacing={3}>
        {loading ? (
          <Grid size={{ xs: 12, md: 12 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                p: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress />
                <Typography color="text.secondary">
                  Carregando assinaturas...
                </Typography>
              </Box>
            </Card>
          </Grid>
        ) : assinaturas.length > 0 ? (
          assinaturas.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Assinatura de e-mail pré-definida
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    {item.isAtual === true && (
                      <Chip label="Atual" color="success" />
                    )}
                  </Box>
                </Box>

                <PreviewAssinatura item={item} />
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12, md: 12 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px dashed",
                borderColor: "divider",
                p: 6,
                textAlign: "center",
                backgroundColor: "background.paper",
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Nenhuma assinatura encontrada
              </Typography>

              <Typography color="text.secondary">
                Tente ajustar a pesquisa ou criar uma nova assinatura.
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default TabAssinaturaPadrao;
