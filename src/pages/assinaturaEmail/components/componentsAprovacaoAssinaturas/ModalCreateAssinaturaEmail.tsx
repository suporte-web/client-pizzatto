import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import type { ChangeEvent } from "react";
// import pizzattoImage from "../../../../imgs/PizzattoLog_logo.png";
import { orange } from "@mui/material/colors";
import { useMask } from "@react-input/mask";
import { removeBackground } from "@imgly/background-removal";
import { useToast } from "../../../../components/Toast";
import { AssinaturaEmailService } from "../../../../stores/assinaturaEmail/service";
import { useUser } from "../../../../UserContext";

type FontSizeKey = "pequeno" | "medio" | "grande";

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
  disabled?: boolean;
};

// type AssinaturaPadrao = {
//   caminhoBackground?: string | null;
//   corFont?: string | null;
//   fontSize?: string | null;
//   photoX?: number | null;
//   photoY?: number | null;
//   photoSize?: number | null;
//   nomeX?: number | null;
//   nomeY?: number | null;
//   departamentoX?: number | null;
//   departamentoY?: number | null;
//   telefoneX?: number | null;
//   telefoneY?: number | null;
//   emailX?: number | null;
//   emailY?: number | null;
//   logoX?: number | null;
//   logoY?: number | null;
//   logoHeight?: number | null;
// };

const SIGNATURE_WIDTH = 520;
const SIGNATURE_HEIGHT = 220;
const DEFAULT_PHOTO_SIZE = 110;
// const DEFAULT_LOGO_HEIGHT = 32;

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

function PhoneField({ value, onChange, disabled = false }: PhoneFieldProps) {
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
      disabled={disabled}
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

const getFontSizeKey = (value?: string | null): FontSizeKey => {
  if (value === "pequeno" || value === "medio" || value === "grande") {
    return value;
  }

  return "medio";
};

const ModalCreateAssinaturaEmail = ({
  setFlushHook,
  assinaturaPadrao,
}: any) => {
  const { user } = useUser();

  const hasUserNome = Boolean(user?.name?.trim());
  const hasUserDepartamento = Boolean(user?.department?.trim());
  const hasUserTelefone = Boolean(user?.telephoneNumber?.trim());
  const hasUserEmail = Boolean(user?.mail?.trim());

  const { showToast } = useToast();
  const assinaturaRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<SignatureData>({
    nome: user?.name || "",
    departamento: user?.department || "",
    telefone: user?.telephoneNumber || "",
    email: user?.mail || "",
    fotoUrl: "",
  });

  const currentFontSize =
    fontSizePresets[getFontSizeKey(assinaturaPadrao?.fontSize)];

  const telefoneCompleto = /^\(\d{2}\) \d{5}-\d{4}$/.test(form.telefone);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange =
    (field: keyof SignatureData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
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
  //   const textColor = assinaturaPadrao?.corFont || "#1f1f1f";
  //   const backgroundUrl = assinaturaPadrao?.caminhoBackground || "";
  //   const photoX = assinaturaPadrao?.photoX ?? 24;
  //   const photoY = assinaturaPadrao?.photoY ?? 42;
  //   const photoSize = assinaturaPadrao?.photoSize ?? DEFAULT_PHOTO_SIZE;
  //   const nomeX = assinaturaPadrao?.nomeX ?? 160;
  //   const nomeY = assinaturaPadrao?.nomeY ?? 35;
  //   const departamentoX = assinaturaPadrao?.departamentoX ?? 160;
  //   const departamentoY = assinaturaPadrao?.departamentoY ?? 65;
  //   const telefoneX = assinaturaPadrao?.telefoneX ?? 160;
  //   const telefoneY = assinaturaPadrao?.telefoneY ?? 110;
  //   const logoX = assinaturaPadrao?.logoX ?? 160;
  //   const logoY = assinaturaPadrao?.logoY ?? 155;
  //   const logoHeight = assinaturaPadrao?.logoHeight ?? DEFAULT_LOGO_HEIGHT;

  //   return `
  //     <div style="
  //       position: relative;
  //       width: ${SIGNATURE_WIDTH}px;
  //       height: ${SIGNATURE_HEIGHT}px;
  //       font-family: Arial, sans-serif;
  //       color: ${textColor};
  //       overflow: hidden;
  //       border: 1px solid #e0e0e0;
  //       border-radius: 12px;
  //       ${
  //         backgroundUrl
  //           ? `background-image: url('${backgroundUrl}');
  //              background-size: cover;
  //              background-position: center top;
  //              background-repeat: no-repeat;
  //              background-color: #ffffff;`
  //           : "background-color: #ffffff;"
  //       }
  //     ">
  //       <div style="
  //         position: absolute;
  //         inset: 0;
  //         border-radius: 12px;
  //       "></div>

  //       <img
  //         src="${form.fotoUrl || "https://via.placeholder.com/90x90.png?text=Foto"}"
  //         alt="Foto"
  //         width="${photoSize}"
  //         height="${photoSize}"
  //         style="
  //           position: absolute;
  //           left: ${photoX}px;
  //           top: ${photoY}px;
  //           width: ${photoSize}px;
  //           height: ${photoSize}px;
  //           border-radius: 50%;
  //           object-fit: cover;
  //           object-position: center top;
  //           border: 2px solid #fff;
  //           z-index: 2;
  //         "
  //       />

  //       <div style="
  //         position: absolute;
  //         left: ${nomeX}px;
  //         top: ${nomeY}px;
  //         font-size: ${currentFontSize.nome}px;
  //         font-weight: 800;
  //         color: ${textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         ${form.nome || "Nome do Colaborador"}
  //       </div>

  //       <div style="
  //         position: absolute;
  //         left: ${departamentoX}px;
  //         top: ${departamentoY}px;
  //         font-size: ${currentFontSize.departamento}px;
  //         color: ${textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         ${form.departamento || "Departamento"}
  //       </div>

  //       <div style="
  //         position: absolute;
  //         left: ${telefoneX}px;
  //         top: ${telefoneY}px;
  //         font-size: ${currentFontSize.contato}px;
  //         color: ${textColor};
  //         z-index: 2;
  //         white-space: nowrap;
  //       ">
  //         <strong>Telefone:</strong> ${form.telefone || "(00) 00000-0000"}
  //       </div>

  //       <img
  //         src="${pizzattoImage}"
  //         alt="Logo"
  //         height="${logoHeight}"
  //         style="
  //           position: absolute;
  //           left: ${logoX}px;
  //           top: ${logoY}px;
  //           height: ${logoHeight}px;
  //           z-index: 2;
  //         "
  //       />
  //     </div>
  //   `.trim();
  // }, [assinaturaPadrao, form, currentFontSize]);

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
      formData.append("departamento", form.departamento);
      formData.append("telefone", form.telefone);
      formData.append("email", form.email);
      formData.append("foto", file);

      await AssinaturaEmailService.create(formData);
      // await navigator.clipboard.writeText(htmlAssinatura);

      showToast("Assinatura criada com sucesso!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
      showToast("Não foi possível criar a assinatura.", "error");
    }
  };

  const textColor = assinaturaPadrao?.corFont || "#1f1f1f";
  const backgroundUrl = assinaturaPadrao?.caminhoBackground || "";
  const photoX = assinaturaPadrao?.photoX ?? 24;
  const photoY = assinaturaPadrao?.photoY ?? 42;
  const photoSize = assinaturaPadrao?.photoSize ?? DEFAULT_PHOTO_SIZE;
  const nomeX = assinaturaPadrao?.nomeX ?? 160;
  const nomeY = assinaturaPadrao?.nomeY ?? 35;
  const departamentoX = assinaturaPadrao?.departamentoX ?? 160;
  const departamentoY = assinaturaPadrao?.departamentoY ?? 65;
  const telefoneX = assinaturaPadrao?.telefoneX ?? 160;
  const telefoneY = assinaturaPadrao?.telefoneY ?? 110;
  // const logoX = assinaturaPadrao?.logoX ?? 160;
  // const logoY = assinaturaPadrao?.logoY ?? 155;
  // const logoHeight = assinaturaPadrao?.logoHeight ?? DEFAULT_LOGO_HEIGHT;

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
                    Informações
                  </Typography>

                  <TextField
                    label="Nome"
                    fullWidth
                    value={form.nome}
                    onChange={handleChange("nome")}
                    size="small"
                    disabled={hasUserNome}
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

                  <TextField
                    label="Departamento"
                    fullWidth
                    value={form.departamento}
                    onChange={handleChange("departamento")}
                    size="small"
                    disabled={hasUserDepartamento}
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

                  <PhoneField
                    value={form.telefone}
                    onChange={handleChange("telefone")}
                    disabled={hasUserTelefone}
                  />

                  <TextField
                    label="E-mail"
                    fullWidth
                    value={form.email}
                    onChange={handleChange("email")}
                    size="small"
                    disabled={hasUserEmail}
                    InputProps={{ style: { borderRadius: 12 } }}
                  />

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

                  <Typography variant="caption" color="text.secondary">
                    O layout da assinatura será aplicado automaticamente com
                    base na assinatura padrão cadastrada.
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
                    {backgroundUrl && (
                      <Box
                        component="img"
                        src={`${import.meta.env.VITE_API_BACKEND}/${backgroundUrl}`}
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
                      component="img"
                      src={
                        form.fotoUrl ||
                        "https://via.placeholder.com/90x90.png?text=Foto"
                      }
                      sx={{
                        position: "absolute",
                        left: photoX,
                        top: photoY,
                        width: photoSize,
                        height: photoSize,
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        border: "3px solid rgba(255,255,255,0.95)",
                        backgroundColor: "transparent",
                        zIndex: 3,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      }}
                    />

                    <Typography
                      component="div"
                      fontWeight={800}
                      sx={{
                        position: "absolute",
                        left: nomeX,
                        top: nomeY,
                        color: textColor,
                        zIndex: 3,
                        fontSize: `${currentFontSize.nome}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.nome || "Nome do Colaborador"}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        position: "absolute",
                        left: departamentoX,
                        top: departamentoY,
                        color: textColor,
                        zIndex: 3,
                        fontSize: `${currentFontSize.departamento}px`,
                        lineHeight: 1.2,
                      }}
                    >
                      {form.departamento || "Departamento"}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        position: "absolute",
                        left: telefoneX,
                        top: telefoneY,
                        color: textColor,
                        zIndex: 3,
                        fontSize: `${currentFontSize.contato}px`,
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
                      sx={{
                        position: "absolute",
                        left: logoX,
                        top: logoY,
                        height: logoHeight,
                        zIndex: 3,
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

export default ModalCreateAssinaturaEmail;
