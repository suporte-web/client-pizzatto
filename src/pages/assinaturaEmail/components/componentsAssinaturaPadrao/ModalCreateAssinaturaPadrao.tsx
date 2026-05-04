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
import { useRef, useState } from "react";
import type {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
// import pizzattoImage from "../../../../imgs/PizzattoLog_logo.png";
import { orange } from "@mui/material/colors";
import { useMask } from "@react-input/mask";
import { removeBackground } from "@imgly/background-removal";
import { useToast } from "../../../../components/Toast";
import { useUser } from "../../../../UserContext";
import { AssinaturaPadraoService } from "../../../../stores/assinaturaPadrao/services";

type FontSizeKey = "pequeno" | "medio" | "grande";
type PositionKey = "foto" | "nome" | "departamento" | "telefone" | "logo";
type TextPositionKey = Extract<PositionKey, "nome" | "departamento" | "telefone">;
type LayoutPresetKey = "padrao" | "compacto" | "centralizado";

type Positions = Record<PositionKey, { x: number; y: number }>;

type TextStyle = {
  color: string;
  fontSize: FontSizeKey;
};

type TextStyles = Record<TextPositionKey, TextStyle>;

type SignatureTemplate = {
  backgroundUrl: string;
  positions: Positions;
  textStyles: TextStyles;
  photoSize: number;
  logoHeight: number;
};

type SignatureData = {
  nome: string;
  departamento: string;
  telefone: string;
  email: string;
  fotoUrl: string;
};

type PhoneFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type DraggingState = {
  key: PositionKey;
  offsetX: number;
  offsetY: number;
} | null;

const SIGNATURE_WIDTH = 520;
const SIGNATURE_HEIGHT = 220;
const PHOTO_SIZE = 110;
const DEFAULT_LOGO_HEIGHT = 32;

const fontSizeOptions = [
  { label: "Pequeno", value: "pequeno" },
  { label: "Médio", value: "medio" },
  { label: "Grande", value: "grande" },
] as const;

const fontSizePresets: Record<
  FontSizeKey,
  {
    nome: number;
    departamento: number;
    contato: number;
  }
> = {
  pequeno: {
    nome: 20,
    departamento: 12,
    contato: 12,
  },
  medio: {
    nome: 24,
    departamento: 14,
    contato: 14,
  },
  grande: {
    nome: 28,
    departamento: 16,
    contato: 16,
  },
};

const DRAG_BOX_SIZES: Record<PositionKey, { width: number; height: number }> = {
  foto: { width: PHOTO_SIZE, height: PHOTO_SIZE },
  nome: { width: 260, height: 34 },
  departamento: { width: 220, height: 24 },
  telefone: { width: 260, height: 24 },
  logo: { width: 110, height: DEFAULT_LOGO_HEIGHT },
};

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
      departamento: { x: 160, y: 65 },
      telefone: { x: 160, y: 135 },
      logo: { x: 160, y: 155 },
    },
    textColor: "#1f1f1f",
  },
  compacto: {
    label: "Compacto",
    positions: {
      foto: { x: 20, y: 42 },
      nome: { x: 140, y: 35 },
      departamento: { x: 140, y: 65 },
      telefone: { x: 140, y: 130 },
      logo: { x: 140, y: 155 },
    },
    textColor: "#1f1f1f",
  },
  centralizado: {
    label: "Centralizado",
    positions: {
      foto: { x: 55, y: 42 },
      nome: { x: 185, y: 35 },
      departamento: { x: 185, y: 65 },
      telefone: { x: 185, y: 135 },
      logo: { x: 185, y: 155 },
    },
    textColor: "#1f1f1f",
  },
};

const clonePositions = (positions: Positions): Positions => ({
  foto: { ...positions.foto },
  nome: { ...positions.nome },
  departamento: { ...positions.departamento },
  telefone: { ...positions.telefone },
  logo: { ...positions.logo },
});

const createDefaultTextStyles = (color = "#1f1f1f"): TextStyles => ({
  nome: { color, fontSize: "medio" },
  departamento: { color, fontSize: "medio" },
  telefone: { color, fontSize: "medio" },
});


const defaultTemplate: SignatureTemplate = {
  backgroundUrl: "",
  positions: clonePositions(layoutPresets.padrao.positions),
  textStyles: createDefaultTextStyles(layoutPresets.padrao.textColor),
  photoSize: PHOTO_SIZE,
  logoHeight: DEFAULT_LOGO_HEIGHT,
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

const ModalCreateAssinaturaPadrao = ({ setFlushHook }: any) => {
  const { user } = useUser();
  const { showToast } = useToast();
  const assinaturaRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] =
    useState<LayoutPresetKey>("padrao");
  const [dragging, setDragging] = useState<DraggingState>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [form, setForm] = useState<SignatureData>({
    nome: user?.name || "",
    departamento: user?.department || "",
    telefone: user?.telephoneNumber || "",
    email: user?.mail || "",
    fotoUrl: "",
  });

  const [selectedElement, setSelectedElement] = useState<PositionKey | null>(
    null,
  );

  const [template, setTemplate] = useState<SignatureTemplate>(defaultTemplate);

  const telefoneCompleto = /^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone);

  const normalizeHexColor = (value: string) => {
    const hex = value.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
    if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    return "#1f1f1f";
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setDragging(null);
    setSelectedElement(null);
    setOpen(false);
  };

  const handleSelectElement = (key: PositionKey) => {
    setSelectedElement(key);
  };

  const handleChangeLayout = (layoutKey: LayoutPresetKey) => {
    setSelectedLayout(layoutKey);

    setTemplate((prev) => ({
      ...prev,
      positions: clonePositions(layoutPresets[layoutKey].positions),
      textStyles: createDefaultTextStyles(layoutPresets[layoutKey].textColor),
    }));
  };

  const handleResetLayout = () => {
    setTemplate((prev) => ({
      ...prev,
      positions: clonePositions(layoutPresets[selectedLayout].positions),
      textStyles: createDefaultTextStyles(layoutPresets[selectedLayout].textColor),
      photoSize: PHOTO_SIZE,
      logoHeight: DEFAULT_LOGO_HEIGHT,
    }));
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

      setSelectedElement(key);
      setDragging({
        key,
        offsetX: pointer.clientX - rect.left - template.positions[key].x,
        offsetY: pointer.clientY - rect.top - template.positions[key].y,
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

    setTemplate((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [dragging.key]: {
          x: nextX,
          y: nextY,
        },
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

      setBackgroundFile(file);
      setTemplate((prev) => ({
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

  // const htmlAssinatura = useMemo(() => {
  //   return `
  //     <div style="
  //       position: relative;
  //       width: ${SIGNATURE_WIDTH}px;
  //       height: ${SIGNATURE_HEIGHT}px;
  //       font-family: Arial, sans-serif;
  //       color: ${template.textColor};
  //       overflow: hidden;
  //       border: 1px solid #e0e0e0;
  //       border-radius: 12px;
  //       ${
  //         template.backgroundUrl
  //           ? `background-image: url('${template.backgroundUrl}');
  //              background-size: cover;
  //              background-position: center top;
  //              background-repeat: no-repeat;
  //              background-color: #ffffff;`
  //           : "background-color: #ffffff;"
  //       }
  //     ">
  //       <img
  //         src="${form.fotoUrl || "https://via.placeholder.com/90x90.png?text=Foto"}"
  //         alt="Foto"
  //         width="${template.photoSize}"
  //         height="${template.photoSize}"
  //         style="
  //           position: absolute;
  //           left: ${template.positions.foto.x}px;
  //           top: ${template.positions.foto.y}px;
  //           width: ${template.photoSize}px;
  //           height: ${template.photoSize}px;
  //           border-radius: 50%;
  //           object-fit: cover;
  //           object-position: center top;
  //           border: 2px solid #fff;
  //           z-index: 2;
  //         "
  //       />

  //       <div style="
  //         position: absolute;
  //         left: ${template.positions.nome.x}px;
  //         top: ${template.positions.nome.y}px;
  //         font-size: ${currentFontSize.nome}px;
  //         font-weight: 800;
  //         color: ${template.textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         ${form.nome || "Nome do Colaborador"}
  //       </div>

  //       <div style="
  //         position: absolute;
  //         left: ${template.positions.departamento.x}px;
  //         top: ${template.positions.departamento.y}px;
  //         font-size: ${currentFontSize.departamento}px;
  //         color: ${template.textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         ${form.departamento || "Departamento"}
  //       </div>

  //       <div style="
  //         position: absolute;
  //         left: ${template.positions.telefone.x}px;
  //         top: ${template.positions.telefone.y}px;
  //         font-size: ${currentFontSize.contato}px;
  //         color: ${template.textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         <strong>Telefone:</strong> ${form.telefone || "(00) 00000-0000"}
  //       </div>

  //       <img
  //         src="${pizzattoImage}"
  //         alt="Logo"
  //         height="${template.logoHeight}"
  //         style="
  //           position: absolute;
  //           left: ${template.positions.logo.x}px;
  //           top: ${template.positions.logo.y}px;
  //           height: ${template.logoHeight}px;
  //           z-index: 2;
  //         "
  //       />
  //     </div>
  //   `.trim();
  // }, [form, template, currentFontSize]);

  const isTextElement = (key: PositionKey | null): key is TextPositionKey =>
    key === "nome" || key === "departamento" || key === "telefone";

  const getElementFontSize = (key: TextPositionKey) => {
    const preset = fontSizePresets[template.textStyles[key].fontSize];

    if (key === "nome") return preset.nome;
    if (key === "departamento") return preset.departamento;

    return preset.contato;
  };

  const updateSelectedTextStyle = <K extends keyof TextStyle>(
    field: K,
    value: TextStyle[K],
  ) => {
    if (!isTextElement(selectedElement)) return;

    setTemplate((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [selectedElement]: {
          ...prev.textStyles[selectedElement],
          [field]: value,
        },
      },
    }));
  };

  const handleCriarAssinatura = async () => {
    try {
      if (!telefoneCompleto) {
        showToast("Preencha um telefone válido.", "warning");
        return;
      }

      if (!backgroundFile) {
        showToast("Faça o upload do background.", "warning");
        return;
      }

      const formData = new FormData();
      formData.append("nomeCorFont", template.textStyles.nome.color);
      formData.append("nomeFontSize", template.textStyles.nome.fontSize);

      formData.append(
        "departamentoCorFont",
        template.textStyles.departamento.color,
      );
      formData.append(
        "departamentoFontSize",
        template.textStyles.departamento.fontSize,
      );

      formData.append("telefoneCorFont", template.textStyles.telefone.color);
      formData.append("telefoneFontSize", template.textStyles.telefone.fontSize);

      formData.append("photoX", String(Math.round(template.positions.foto.x)));
      formData.append("photoY", String(Math.round(template.positions.foto.y)));
      formData.append("photoSize", String(template.photoSize));

      formData.append("nomeX", String(Math.round(template.positions.nome.x)));
      formData.append("nomeY", String(Math.round(template.positions.nome.y)));

      formData.append(
        "departamentoX",
        String(Math.round(template.positions.departamento.x)),
      );
      formData.append(
        "departamentoY",
        String(Math.round(template.positions.departamento.y)),
      );

      formData.append(
        "telefoneX",
        String(Math.round(template.positions.telefone.x)),
      );
      formData.append(
        "telefoneY",
        String(Math.round(template.positions.telefone.y)),
      );

      formData.append("logoX", String(Math.round(template.positions.logo.x)));
      formData.append("logoY", String(Math.round(template.positions.logo.y)));
      formData.append("logoHeight", String(template.logoHeight));

      formData.append("background", backgroundFile);

      await AssinaturaPadraoService.create(formData);
      // await navigator.clipboard.writeText(htmlAssinatura);

      showToast("Template de assinatura salvo com sucesso!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar assinatura padrão:", error);
      showToast("Não foi possível salvar a assinatura padrão.", "error");
    }
  };

  const draggableItemSx = (key: PositionKey) => ({
    position: "absolute" as const,
    left: template.positions[key].x,
    top: template.positions[key].y,
    zIndex: 3,
    cursor: dragging?.key === key ? "grabbing" : "grab",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    touchAction: "none" as const,
    transition: dragging?.key === key ? "none" : "box-shadow 0.2s ease",
    outline: selectedElement === key ? "2px dashed #ff9800" : "none",
    outlineOffset: 2,
    "&:hover": {
      boxShadow: "0 0 0 1px rgba(255,255,255,0.65)",
      borderRadius: 1,
    },
  });

  return (
    <>
      <Tooltip title="Criar Assinatura Padrão">
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
          <Add /> Criar Assinatura Padrão
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
          }}
        >
          Gerar Assinatura de E-mail Pré-definida
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

                    {isTextElement(selectedElement) && (
                      <>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                component="input"
                                type="color"
                                value={normalizeHexColor(
                                  template.textStyles[selectedElement].color,
                                )}
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateSelectedTextStyle(
                                    "color",
                                    event.target.value,
                                  )
                                }
                                sx={{
                                  width: 52,
                                  height: 40,
                                  p: 0,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 2,
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                }}
                              />

                              <TextField
                                label="Cor"
                                value={template.textStyles[selectedElement].color}
                                onChange={(event) =>
                                  updateSelectedTextStyle(
                                    "color",
                                    event.target.value,
                                  )
                                }
                                onBlur={(event) =>
                                  updateSelectedTextStyle(
                                    "color",
                                    normalizeHexColor(event.target.value),
                                  )
                                }
                                fullWidth
                                size="small"
                                placeholder="#1f1f1f"
                                InputProps={{ style: { borderRadius: 12 } }}
                              />
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            select
                            label="Tamanho da fonte"
                            value={
                              template.textStyles[selectedElement].fontSize
                            }
                            onChange={(event) =>
                              updateSelectedTextStyle(
                                "fontSize",
                                event.target.value as FontSizeKey,
                              )
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
                      </>
                    )}
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
                    label="Departamento"
                    fullWidth
                    value={form.departamento}
                    onChange={handleChange("departamento")}
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

                  {selectedElement && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} mb={1}>
                        Elemento selecionado: {selectedElement}
                      </Typography>
                      <Typography variant="body2">
                        X: {Math.round(template.positions[selectedElement].x)} |
                        Y: {Math.round(template.positions[selectedElement].y)}
                      </Typography>

                      {!isTextElement(selectedElement) && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mt={1}
                        >
                          Cor e tamanho de fonte ficam disponíveis apenas para
                          nome, departamento e telefone.
                        </Typography>
                      )}
                    </Paper>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Você pode arrastar foto, nome, departamento, telefone e logo
                    diretamente na pré-visualização.
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
                    {template.backgroundUrl && (
                      <Box
                        component="img"
                        src={template.backgroundUrl}
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
                      onClick={() => handleSelectElement("foto")}
                      sx={{
                        position: "absolute",
                        left: template.positions.foto.x,
                        top: template.positions.foto.y,
                        width: template.photoSize,
                        height: template.photoSize,
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        border: "3px solid rgba(255,255,255,0.95)",
                        backgroundColor: "transparent",
                        zIndex: 3,
                        boxShadow:
                          selectedElement === "foto"
                            ? "0 0 0 2px #ff9800"
                            : "0 8px 20px rgba(0,0,0,0.12)",
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
                      onClick={() => handleSelectElement("nome")}
                      sx={{
                        ...draggableItemSx("nome"),
                        color: template.textStyles.nome.color,
                        fontSize: `${getElementFontSize("nome")}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.nome || "Nome do Colaborador"}
                    </Typography>

                    <Typography
                      component="div"
                      onMouseDown={startDrag("departamento")}
                      onTouchStart={startDrag("departamento")}
                      onClick={() => handleSelectElement("departamento")}
                      sx={{
                        ...draggableItemSx("departamento"),
                        color: template.textStyles.departamento.color,
                        fontSize: `${getElementFontSize("departamento")}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.departamento || "Departamento"}
                    </Typography>

                    <Typography
                      component="div"
                      onMouseDown={startDrag("telefone")}
                      onTouchStart={startDrag("telefone")}
                      onClick={() => handleSelectElement("telefone")}
                      sx={{
                        ...draggableItemSx("telefone"),
                        color: template.textStyles.telefone.color,
                        fontSize: `${getElementFontSize("telefone")}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      <strong>Telefone:</strong>{" "}
                      {form.telefone || "(00) 00000-0000"}
                    </Typography>

                    {/* <Box
                      component="img"
                      src={pizzattoImage}
                      alt="Logo"
                      onMouseDown={startDrag("logo")}
                      onTouchStart={startDrag("logo")}
                      onClick={() => handleSelectElement("logo")}
                      sx={{
                        position: "absolute",
                        left: template.positions.logo.x,
                        top: template.positions.logo.y,
                        height: template.logoHeight,
                        zIndex: 3,
                        cursor: dragging?.key === "logo" ? "grabbing" : "grab",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        touchAction: "none",
                        outline:
                          selectedElement === "logo"
                            ? "2px dashed #ff9800"
                            : "none",
                        outlineOffset: 2,
                        "&:hover": {
                          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                        },
                      }}
                    /> */}
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

export default ModalCreateAssinaturaPadrao;
