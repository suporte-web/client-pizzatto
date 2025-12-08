import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BAHIA_OPTIONS,
  COSTEIRA_OPTIONS,
  MATRIZ_OPTIONS,
  PARANA_OPTIONS,
  PRINCIPAL_FOLDER_OPTIONS,
  SAO_PAULO_OPTIONS,
  TERCEIROS_OPTIONS,
} from "./OuOptions";
import { UserAdService } from "../../../stores/usersAd/service";

const ModalCriarUserAD = ({ showToast }: any) => {
  const [open, setOpen] = useState(false);

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [username, setUsername] = useState("");
  const [setor, setSetor] = useState("");
  const [pastaPrincipal, setPastaPrincipal] = useState("");
  const [pastaSecundaria, setPastaSecundaria] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPrimeiroNome("");
    setSobrenome("");
    setUsername("");
    setSetor("");
    setPastaPrincipal("");
    setPastaSecundaria("");
  };

  // Atualiza o userName automaticamente
  useEffect(() => {
    const partes = sobrenome.trim().split(" ").filter(Boolean);
    const ultimoSobrenome = partes.length > 0 ? partes[partes.length - 1] : "";

    if (primeiroNome && ultimoSobrenome) {
      setUsername(
        `${primeiroNome.toLowerCase()}.${ultimoSobrenome.toLowerCase()}`
      );
    } else {
      setUsername("");
    }
  }, [primeiroNome, sobrenome]);

  const getFinalFolderValue = () => {
    if (setor) return setor; // nível mais baixo
    if (pastaSecundaria) return pastaSecundaria;
    return pastaPrincipal;
  };

  const buildOuPath = () => {
    const parts = [setor, pastaSecundaria, pastaPrincipal].filter(
      (v) => v && v.startsWith("OU=")
    ) as string[];

    return parts.join(",");
  };

  const handleCreateUser = async () => {
    try {
      const finalFolder = getFinalFolderValue();

      if (!finalFolder || !finalFolder.startsWith("OU=")) {
        showToast(
          "Não é permitido salvar um usuário em uma pasta que não seja OU final.",
          "error"
        );
        return;
      }

      const ouPath = buildOuPath();

      const payload = {
        primeiroNome,
        sobrenome,
        username,
        pastaPrincipal,
        pastaSecundaria,
        setor,
        ouPath,
      };

      // TODO: enviar para API
      console.log("Payload para criação do usuário:", payload);

      await UserAdService.create(payload);

      showToast("Usuário criado com sucesso!", "success");
      handleClose();
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Usuário!", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar usuário no AD">
        <IconButton
          onClick={handleOpen}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            width: 46,
            height: 46,
          }}
          size="small"
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Criar Usuário no AD
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha os dados abaixo para gerar o usuário automaticamente.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* Nome / Sobrenome */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Primeiro Nome"
                  size="small"
                  fullWidth
                  value={primeiroNome}
                  onChange={(e) => setPrimeiroNome(e.target.value)}
                  InputProps={{ style: { borderRadius: 10 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Sobrenome (Completo)"
                  size="small"
                  fullWidth
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  InputProps={{ style: { borderRadius: 10 } }}
                />
              </Grid>
            </Grid>

            {/* Username gerado */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: "grey.100",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Username gerado:
              </Typography>
              <Chip
                size="small"
                label={username || "aguardando nome..."}
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {/* Pasta Principal */}
            <FormControl size="small" fullWidth>
              <InputLabel>Pasta Principal</InputLabel>
              <Select
                value={pastaPrincipal}
                label="Pasta Principal"
                onChange={(e) => {
                  setPastaPrincipal(e.target.value);
                  setPastaSecundaria("");
                  setSetor("");
                }}
                sx={{ borderRadius: 2 }}
              >
                {PRINCIPAL_FOLDER_OPTIONS.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={{ gap: 1.5, alignItems: "center" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      {item.icon} {item.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Pasta Secundária */}
            {(pastaPrincipal === "Paraná" ||
              pastaPrincipal === "São Paulo" ||
              pastaPrincipal === "Bahia" ||
              pastaPrincipal === "Terceiros") && (
              <FormControl fullWidth size="small">
                <InputLabel>Pasta Secundária (Filiais)</InputLabel>
                <Select
                  value={pastaSecundaria}
                  label="Pasta Secundária (Filiais)"
                  onChange={(e) => {
                    setPastaSecundaria(e.target.value);
                    setSetor("");
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  {(pastaPrincipal === "Paraná"
                    ? PARANA_OPTIONS
                    : pastaPrincipal === "São Paulo"
                    ? SAO_PAULO_OPTIONS
                    : pastaPrincipal === "Bahia"
                    ? BAHIA_OPTIONS
                    : pastaPrincipal === "Terceiros"
                    ? TERCEIROS_OPTIONS
                    : []
                  ).map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {item.icon} {item.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Pasta Final (Setores) */}
            {(pastaSecundaria === "Matriz" ||
              pastaSecundaria === "Costeira") && (
              <FormControl fullWidth size="small">
                <InputLabel>Pasta Final (Setores)</InputLabel>
                <Select
                  value={setor}
                  label="Pasta Final (Setores)"
                  onChange={(e) => {
                    setSetor(e.target.value);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  {(pastaSecundaria === "Matriz"
                    ? MATRIZ_OPTIONS
                    : pastaSecundaria === "Costeira"
                    ? COSTEIRA_OPTIONS
                    : []
                  ).map((item) => (
                    <MenuItem
                      key={item.value}
                      value={item.value}
                      sx={{ gap: 1.5, alignItems: "center" }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {item.icon} {item.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="text"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreateUser}
            endIcon={<Add />}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Criar usuário
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarUserAD;
