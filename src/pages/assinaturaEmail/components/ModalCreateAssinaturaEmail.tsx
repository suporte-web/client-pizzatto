import { Add, RestartAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import type {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import pizzattoImage from "../../../imgs/PizzattoLog_logo.png";
import { orange } from "@mui/material/colors";
import { useMask } from "@react-input/mask";
import { useToast } from "../../../components/Toast";
import { AssinaturaEmailService } from "../../../stores/assinaturaEmail/service";
import { removeBackground } from "@imgly/background-removal";

type FontSizeKey = "pequeno" | "medio" | "grande";

const fontSizeOptions = [
  { label: "Pequeno", value: "pequeno" },
  { label: "Médio", value: "medio" },
  { label: "Grande", value: "grande" },
] as const;

const fontSizePresets: Record<
  FontSizeKey,
  {
    nome: number;
    cargo: number;
    contato: number;
  }
> = {
  pequeno: {
    nome: 20,
    cargo: 12,
    contato: 12,
  },
  medio: {
    nome: 24,
    cargo: 14,
    contato: 14,
  },
  grande: {
    nome: 28,
    cargo: 16,
    contato: 16,
  },
};

type SignatureData = {
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  fotoUrl: string;
  backgroundUrl: string;
};

type PhoneFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type PositionKey = "foto" | "nome" | "cargo" | "telefone" | "email" | "logo";

type Positions = Record<PositionKey, { x: number; y: number }>;

type LayoutPresetKey = "padrao" | "compacto" | "centralizado";

type DraggingState = {
  key: PositionKey;
  offsetX: number;
  offsetY: number;
} | null;

const SIGNATURE_WIDTH = 520;
const SIGNATURE_HEIGHT = 220;
const PHOTO_SIZE = 110;

const DRAG_BOX_SIZES: Record<PositionKey, { width: number; height: number }> = {
  foto: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  nome: { width: 260, height: 34 },
  cargo: { width: 220, height: 24 },
  telefone: { width: 260, height: 24 },
  email: { width: 280, height: 24 },
  logo: { width: 110, height: 32 },
};

function PhoneField({ value, onChange }: PhoneFieldProps) {
  const inputRef = useMask({
    mask: "(__) _____-____",
    replacement: { _: /\d/ },
  });

  return (
    <TextField
      inputRef={inputRef}
      label="Telefone"
      value={value || ""}
      onChange={onChange}
      fullWidth
      size="small"
      InputProps={{ style: { borderRadius: 12 } }}
      inputProps={{ inputMode: "numeric" }}
    />
  );
}

const toDataUrl = (fileOrBlob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(fileOrBlob);
  });

const colorOptions = [
  { label: "Preto", value: "#1f1f1f" },
  { label: "Branco", value: "#ffffff" },
  { label: "Laranja", value: "#ff6f00" },
  { label: "Azul", value: "#1565c0" },
  { label: "Verde", value: "#2e7d32" },
  { label: "Roxo", value: "#6a1b9a" },
  { label: "Vermelho", value: "#c62828" },
];

export const layoutPresets: Record<
  LayoutPresetKey,
  {
    label: string;
    positions: Positions;
    textColor: string;
  }
> = {
  padrao: {
    label: "Padrão",
    positions: {
      foto: { x: 24, y: 42 },
      nome: { x: 160, y: 35 },
      cargo: { x: 160, y: 65 },
      telefone: { x: 160, y: 110 },
      email: { x: 160, y: 135 },
      logo: { x: 160, y: 155 },
    },
    textColor: "#1f1f1f",
  },
  compacto: {
    label: "Compacto",
    positions: {
      foto: { x: 20, y: 42 },
      nome: { x: 140, y: 35 },
      cargo: { x: 140, y: 65 },
      telefone: { x: 140, y: 110 },
      email: { x: 140, y: 130 },
      logo: { x: 140, y: 155 },
    },
    textColor: "#1f1f1f",
  },
  centralizado: {
    label: "Centralizado",
    positions: {
      foto: { x: 55, y: 42 },
      nome: { x: 185, y: 35 },
      cargo: { x: 185, y: 65 },
      telefone: { x: 185, y: 110 },
      email: { x: 185, y: 135 },
      logo: { x: 185, y: 155 },
    },
    textColor: "#1f1f1f",
  },
};

const clonePositions = (positions: Positions): Positions => ({
  foto: { ...positions.foto },
  nome: { ...positions.nome },
  cargo: { ...positions.cargo },
  telefone: { ...positions.telefone },
  email: { ...positions.email },
  logo: { ...positions.logo },
});

const ModalCreateAssinaturaEmail = ({ setFlushHook }: any) => {
  const { showToast } = useToast();
  const assinaturaRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] =
    useState<LayoutPresetKey>("padrao");
  const [dragging, setDragging] = useState<DraggingState>(null);

  const [form, setForm] = useState<SignatureData>({
    nome: "",
    cargo: "",
    telefone: "",
    email: "",
    fotoUrl: "",
    backgroundUrl: "",
  });

  const [positions, setPositions] = useState<Positions>(
    clonePositions(layoutPresets.padrao.positions),
  );
  const [textColor, setTextColor] = useState(layoutPresets.padrao.textColor);
  const [fontSize, setFontSize] = useState<FontSizeKey>("medio");

  const currentFontSize = fontSizePresets[fontSize];

  const telefoneCompleto = /^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setDragging(null);
    setOpen(false);
  };

  const handleChangeLayout = (layoutKey: LayoutPresetKey) => {
    setSelectedLayout(layoutKey);
    setPositions(clonePositions(layoutPresets[layoutKey].positions));
    setTextColor(layoutPresets[layoutKey].textColor);
  };

  const handleResetLayout = () => {
    setPositions(clonePositions(layoutPresets[selectedLayout].positions));
    setTextColor(layoutPresets[selectedLayout].textColor);
    setFontSize("medio");
  };

  const handleChange =
    (field: keyof SignatureData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const getPointerPosition = (
    event:
      | ReactMouseEvent<HTMLDivElement>
      | ReactTouchEvent<HTMLDivElement>
      | MouseEvent
      | TouchEvent,
  ) => {
    if ("touches" in event && event.touches.length > 0) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      };
    }

    if ("changedTouches" in event && event.changedTouches.length > 0) {
      return {
        clientX: event.changedTouches[0].clientX,
        clientY: event.changedTouches[0].clientY,
      };
    }

    return {
      clientX: (event as MouseEvent).clientX,
      clientY: (event as MouseEvent).clientY,
    };
  };

  const startDrag =
    (key: PositionKey) =>
    (
      event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>,
    ) => {
      if (!assinaturaRef.current) return;

      const rect = assinaturaRef.current.getBoundingClientRect();
      const pointer = getPointerPosition(event);

      setDragging({
        key,
        offsetX: pointer.clientX - rect.left - positions[key].x,
        offsetY: pointer.clientY - rect.top - positions[key].y,
      });
    };

  const updateDragPosition = (clientX: number, clientY: number) => {
    if (!dragging || !assinaturaRef.current) return;

    const rect = assinaturaRef.current.getBoundingClientRect();
    const { width, height } = DRAG_BOX_SIZES[dragging.key];

    const rawX = clientX - rect.left - dragging.offsetX;
    const rawY = clientY - rect.top - dragging.offsetY;

    const maxX = SIGNATURE_WIDTH - width;
    const maxY = SIGNATURE_HEIGHT - height;

    const nextX = Math.min(Math.max(0, rawX), maxX);
    const nextY = Math.min(Math.max(0, rawY), maxY);

    setPositions((prev) => ({
      ...prev,
      [dragging.key]: {
        x: nextX,
        y: nextY,
      },
    }));
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateDragPosition(event.clientX, event.clientY);
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const pointer = getPointerPosition(event);
    updateDragPosition(pointer.clientX, pointer.clientY);
  };

  const stopDrag = () => setDragging(null);

  const handleUploadBackground = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = await toDataUrl(file);

      setForm((prev) => ({
        ...prev,
        backgroundUrl: previewUrl,
      }));
    } catch (error) {
      console.error("Erro ao processar fundo:", error);
      showToast("Não foi possível carregar o fundo.", "error");
    }
  };

  const handleUploadFoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      showToast("Removendo fundo da foto...", "info");

      const blobSemFundo = await removeBackground(file);
      const previewUrl = await toDataUrl(blobSemFundo);

      setForm((prev) => ({
        ...prev,
        fotoUrl: previewUrl,
      }));

      showToast("Foto processada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover fundo da foto:", error);
      showToast("Não foi possível remover o fundo da foto.", "error");
    }
  };

  const htmlAssinatura = useMemo(() => {
    return `
      <div style="
        position: relative;
        width: ${SIGNATURE_WIDTH}px;
        height: ${SIGNATURE_HEIGHT}px;
        font-family: Arial, sans-serif;
        color: ${textColor};
        overflow: hidden;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        ${
          form.backgroundUrl
            ? `background-image: url('${form.backgroundUrl}');
       background-size: cover;
       background-position: center top;
       background-repeat: no-repeat;
       background-color: #ffffff;`
            : "background-color: #ffffff;"
        }
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 12px;
        "></div>

        <img
          src="${form.fotoUrl || "https://via.placeholder.com/90x90.png?text=Foto"}"
          alt="Foto"
          width="${PHOTO_SIZE}"
          height="${PHOTO_SIZE}"
          style="
            position: absolute;
            left: ${positions.foto.x}px;
            top: ${positions.foto.y}px;
            width: ${PHOTO_SIZE}px;
            height: ${PHOTO_SIZE}px;
            border-radius: 50%;
            object-fit: cover;
            object-position: center top;
            border: 2px solid #fff;
            z-index: 2;
          "
        />

        <div style="
          position: absolute;
          left: ${positions.nome.x}px;
          top: ${positions.nome.y}px;
          font-size: ${currentFontSize.nome}px;
          font-weight: 800;
          color: ${textColor};
          z-index: 2;
          white-space: nowrap;
        ">
          ${form.nome || "Nome do Colaborador"}
        </div>

        <div style="
          position: absolute;
          left: ${positions.cargo.x}px;
          top: ${positions.cargo.y}px;
          font-size: ${currentFontSize.cargo}px;
          color: ${textColor};
          z-index: 2;
          white-space: nowrap;
        ">
          ${form.cargo || "Cargo"}
        </div>

        <div style="
          position: absolute;
          left: ${positions.telefone.x}px;
          top: ${positions.telefone.y}px;
          font-size: ${currentFontSize.contato}px;
          color: ${textColor};
          z-index: 2;
          white-space: nowrap;
        ">
          <strong>Telefone:</strong> ${form.telefone || "(00) 00000-0000"}
        </div>

        <div style="
          position: absolute;
          left: ${positions.email.x}px;
          top: ${positions.email.y}px;
          font-size: ${currentFontSize.contato}px;
          color: ${textColor};
          z-index: 2;
          white-space: nowrap;
        ">
          <strong>E-mail:</strong>
          <a href="mailto:${form.email}" style="color: ${textColor}; text-decoration: none;">
            ${form.email || "email@empresa.com.br"}
          </a>
        </div>

        <img
          src="${pizzattoImage}"
          alt="Logo"
          height="28"
          style="
            position: absolute;
            left: ${positions.logo.x}px;
            top: ${positions.logo.y}px;
            height: 28px;
            z-index: 2;
          "
        />
      </div>
    `.trim();
  }, [form, textColor, positions, currentFontSize]);

  const handleCriarAssinatura = async () => {
    try {
      if (!telefoneCompleto) {
        showToast("Preencha um telefone válido.", "warning");
        return;
      }

      if (!assinaturaRef.current) {
        showToast("Não foi possível gerar a assinatura.", "error");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const blob = await toBlob(assinaturaRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      if (!blob) {
        showToast(
          "Não foi possível converter a assinatura em imagem.",
          "error",
        );
        return;
      }

      const file = new File(
        [blob],
        `assinatura-${form.nome || "colaborador"}.jpg`,
        {
          type: "image/jpeg",
        },
      );

      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("cargo", form.cargo);
      formData.append("telefone", form.telefone);
      formData.append("email", form.email);
      formData.append("foto", file);

      await AssinaturaEmailService.create(formData);
      await navigator.clipboard.writeText(htmlAssinatura);

      showToast("Assinatura criada com sucesso!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
      showToast("Não foi possível criar a assinatura.", "error");
    }
  };

  const draggableItemSx = (key: PositionKey) => ({
    position: "absolute" as const,
    left: positions[key].x,
    top: positions[key].y,
    color: textColor,
    zIndex: 3,
    cursor: dragging?.key === key ? "grabbing" : "grab",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    touchAction: "none" as const,
    transition: dragging?.key === key ? "none" : "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 0 0 1px rgba(255,255,255,0.65)",
      borderRadius: 1,
    },
  });

  return (
    <>
      <Tooltip title="Criar Assinatura">
        <Button
          variant="contained"
          onClick={handleOpen}
          fullWidth
          sx={{
            borderRadius: "10px",
            bgcolor: orange[200],
            color: "#3a2500",
            "&:hover": { bgcolor: orange[300] },
          }}
        >
          <Add /> Criar Assinatura
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            borderBottom: "1px solid",
            borderColor: "divider",
            // background:
            //   "linear-gradient(90deg, rgba(255,243,224,1) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          Gerar Assinatura de E-mail
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "#fafafa",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Configurações
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        select
                        label="Modelo"
                        value={selectedLayout}
                        onChange={(event) =>
                          handleChangeLayout(
                            event.target.value as LayoutPresetKey,
                          )
                        }
                        fullWidth
                        size="small"
                        InputProps={{ style: { borderRadius: 12 } }}
                      >
                        {Object.entries(layoutPresets).map(([key, preset]) => (
                          <MenuItem key={key} value={key}>
                            {preset.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        select
                        label="Cor do texto"
                        value={textColor}
                        onChange={(event) => setTextColor(event.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{ style: { borderRadius: 12 } }}
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                      >
                        {colorOptions.map((color) => (
                          <MenuItem key={color.value} value={color.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  backgroundColor: color.value,
                                  border: "1px solid #ccc",
                                }}
                              />
                              {color.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        select
                        label="Tamanho da fonte"
                        value={fontSize}
                        onChange={(event) =>
                          setFontSize(event.target.value as FontSizeKey)
                        }
                        fullWidth
                        size="small"
                        InputProps={{ style: { borderRadius: 12 } }}
                      >
                        {fontSizeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField
                    label="Nome"
                    fullWidth
                    value={form.nome}
                    onChange={handleChange("nome")}
                    size="small"
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

                  <TextField
                    label="Cargo"
                    fullWidth
                    value={form.cargo}
                    onChange={handleChange("cargo")}
                    size="small"
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

                  <PhoneField
                    value={form.telefone}
                    onChange={handleChange("telefone")}
                  />

                  <TextField
                    label="E-mail"
                    fullWidth
                    value={form.email}
                    onChange={handleChange("email")}
                    size="small"
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {/* <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                    > */}
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ borderRadius: 2.5 }}
                      >
                        Upload da Foto
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleUploadFoto}
                        />
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ borderRadius: 2.5 }}
                      >
                        Upload do Fundo
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleUploadBackground}
                        />
                      </Button>
                    </Grid>
                  </Grid>

                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<RestartAlt />}
                    onClick={handleResetLayout}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Resetar layout
                  </Button>
                  {/* </Box> */}

                  <Typography variant="caption" color="text.secondary">
                    Você pode arrastar foto, nome, cargo, telefone, e-mail e
                    logo diretamente na pré-visualização.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "#fafafa",
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={800} mb={2}>
                  Pré-visualização
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background:
                      "linear-gradient(180deg, #f8f9fb 0%, #eef1f6 100%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300,
                  }}
                >
                  <Box
                    ref={assinaturaRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={stopDrag}
                    sx={{
                      position: "relative",
                      width: SIGNATURE_WIDTH,
                      height: SIGNATURE_HEIGHT,
                      border: "1px solid #d9dee7",
                      borderRadius: 3,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      boxShadow: "0 14px 35px rgba(31, 41, 55, 0.12)",
                    }}
                  >
                    {form.backgroundUrl && (
                      <Box
                        component="img"
                        src={form.backgroundUrl}
                        alt="Fundo da assinatura"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "revert",
                          objectPosition: "center top",
                          zIndex: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        // background:
                        //   "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.28) 100%)",
                        zIndex: 1,
                      }}
                    />

                    <Box
                      component="img"
                      src={
                        form.fotoUrl ||
                        "https://via.placeholder.com/90x90.png?text=Foto"
                      }
                      // alt="Foto do colaborador"
                      onMouseDown={startDrag("foto")}
                      onTouchStart={startDrag("foto")}
                      sx={{
                        position: "absolute",
                        left: positions.foto.x,
                        top: positions.foto.y,
                        width: PHOTO_SIZE,
                        height: PHOTO_SIZE,
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        border: "3px solid rgba(255,255,255,0.95)",
                        backgroundColor: "transparent",
                        zIndex: 3,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        cursor: dragging?.key === "foto" ? "grabbing" : "grab",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        touchAction: "none",
                        "&:hover": {
                          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                        },
                      }}
                    />

                    <Typography
                      component="div"
                      fontWeight={800}
                      onMouseDown={startDrag("nome")}
                      onTouchStart={startDrag("nome")}
                      sx={{
                        ...draggableItemSx("nome"),
                        fontSize: `${currentFontSize.nome}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.nome || "Nome do Colaborador"}
                    </Typography>

                    <Typography
                      component="div"
                      onMouseDown={startDrag("cargo")}
                      onTouchStart={startDrag("cargo")}
                      sx={{
                        ...draggableItemSx("cargo"),
                        fontSize: `${currentFontSize.cargo}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.cargo || "Cargo"}
                    </Typography>

                    <Typography
                      component="div"
                      onMouseDown={startDrag("telefone")}
                      onTouchStart={startDrag("telefone")}
                      sx={{
                        ...draggableItemSx("telefone"),
                        fontSize: `${currentFontSize.contato}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      <strong>Telefone:</strong>{" "}
                      {form.telefone || "(00) 00000-0000"}
                    </Typography>

                    <Typography
                      component="div"
                      onMouseDown={startDrag("email")}
                      onTouchStart={startDrag("email")}
                      sx={{
                        ...draggableItemSx("email"),
                        fontSize: `${currentFontSize.contato}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      <strong>E-mail:</strong>{" "}
                      {form.email || "email@empresa.com.br"}
                    </Typography>

                    <Box
                      component="img"
                      src={pizzattoImage}
                      alt="Logo"
                      onMouseDown={startDrag("logo")}
                      onTouchStart={startDrag("logo")}
                      sx={{
                        position: "absolute",
                        left: positions.logo.x,
                        top: positions.logo.y,
                        height: 32,
                        zIndex: 3,
                        cursor: dragging?.key === "logo" ? "grabbing" : "grab",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        touchAction: "none",
                        "&:hover": {
                          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2.5, minWidth: 120 }}
            onClick={handleClose}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ borderRadius: 2.5, minWidth: 170, fontWeight: 700 }}
            onClick={handleCriarAssinatura}
          >
            Criar Assinatura
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateAssinaturaEmail;
