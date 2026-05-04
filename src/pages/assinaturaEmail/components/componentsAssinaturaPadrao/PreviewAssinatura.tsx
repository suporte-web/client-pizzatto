import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
// import pizzattoImage from "../../../../imgs/PizzattoLog_logo.png";

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
  nomeCorFont?: string | null;
  nomeFontSize?: string | number | null;

  departamentoX?: PositionValue;
  departamentoY?: PositionValue;
  departamentoCorFont?: string | null;
  departamentoFontSize?: string | number | null;

  telefoneX?: PositionValue;
  telefoneY?: PositionValue;
  telefoneCorFont?: string | null;
  telefoneFontSize?: string | number | null;

  logoX?: PositionValue;
  logoY?: PositionValue;
  logoHeight?: PositionValue;

  isAtual?: boolean;
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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [renderSize, setRenderSize] = useState({ width: 1, height: 1 });

  const nomeCorFonte = item.nomeCorFont || item.corFont || "#000000";
  const departamentoCorFonte =
    item.departamentoCorFont || item.corFont || "#000000";
  const telefoneCorFonte = item.telefoneCorFont || item.corFont || "#000000";

  const fontSizeMap: Record<string, number> = {
    pequeno: 12,
    medio: 14,
    grande: 16,
  };

  const resolveFontSize = (
    value: string | number | null | undefined,
    fallback = 14,
  ) => {
    if (typeof value === "number") return value;

    const normalized = String(value || "").trim();

    if (fontSizeMap[normalized]) return fontSizeMap[normalized];

    const parsed = toNumber(normalized);
    return parsed ?? fallback;
  };

  const nomeFontSizeRaw = resolveFontSize(
    item.nomeFontSize || item.fontSize,
    24,
  );
  const departamentoFontSizeRaw = resolveFontSize(
    item.departamentoFontSize || item.fontSize,
    14,
  );
  const telefoneFontSizeRaw = resolveFontSize(
    item.telefoneFontSize || item.fontSize,
    14,
  );

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

  const nomeFontSize = `${nomeFontSizeRaw * scaleX}px`;
  const departamentoFontSize = `${departamentoFontSizeRaw * scaleX}px`;
  const telefoneFontSize = `${telefoneFontSizeRaw * scaleX}px`;

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

  // const sizeByY = (value: PositionValue) => {
  //   if (value === null || value === undefined || value === "") return undefined;
  //   if (hasPercentUnit(value)) return value as string;

  //   const num = toNumber(value);
  //   if (num === null) return undefined;

  //   return `${num * scaleY}px`;
  // };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: `${SIGNATURE_WIDTH} / ${SIGNATURE_HEIGHT}`,
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
          height: "100%",
          display: "block",
          objectFit: "fill",
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
            color: nomeCorFonte,
            fontSize: nomeFontSize,
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
            color: departamentoCorFonte,
            fontSize: departamentoFontSize,
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
            color: telefoneCorFonte,
            fontSize: telefoneFontSize,
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

      {/* {renderIfPositioned(item.logoX, item.logoY, item.logoHeight) && (
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
      )} */}
    </Box>
  );
};

export default PreviewAssinatura;
