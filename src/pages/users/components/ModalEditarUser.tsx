import { PersonAdd, Close, Save, Edit } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { useToast } from "../../../components/Toast";
import { UserService } from "../../../stores/users/service";
import moment from "moment";

const ModalEditarUser = ({ setFlushHook, item }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(item.nome);
  const [email, setEmail] = useState(item.email);
  const [administrador, setAdministrador] = useState(
    item?.acessos?.administrador
  );
  const [financeiro, setFinanceiro] = useState(item?.acessos?.financeiro);
  const [rh, setRh] = useState(item?.acessos?.rh);
  const [comercial, setComercial] = useState(item?.acessos?.comercial);
  const [contratos, setContratos] = useState(item?.acessos?.contratos);
  const [retropatio, setRetropatio] = useState(item?.acessos?.retropatio);
  const [loading, setLoading] = useState(false);

  const handleEditUser = async () => {
    setLoading(true);
    try {
      await UserService.update(item._id, {
        nome,
        email,
        "acessos.administrador": administrador,
        "acessos.financeiro": financeiro,
        "acessos.rh": rh,
        "acessos.comercial": comercial,
        "acessos.contratos": contratos,
        "acessos.retropatio": retropatio,
      });
      setFlushHook((prev: any) => !prev);
      showToast("Usuário criado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showToast("Erro ao editar usuário", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Editar Usuário" arrow>
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <Edit />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "white",
              color: "primary.main",
              width: 32,
              height: 32,
            }}
          >
            <PersonAdd fontSize="small" />
          </Avatar>
          <Typography variant="h6" component="span" fontWeight="600">
            Criar Novo Usuário
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              ml: "auto",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}
          >
            <TextField
              label="Nome Completo"
              variant="outlined"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              label="E-mail"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
            />

            <Box
              sx={{
                backgroundColor: "grey.50",
                borderRadius: "12px",
                p: 2,
                mt: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Data de admissão:</strong>{" "}
                {moment(item.createdAt).format("DD/MM/YYYY")}
              </Typography>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={administrador}
                    onChange={(e) => {
                      setAdministrador(e.target.checked);
                    }}
                  />
                }
                label="Administrador"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={financeiro}
                    onChange={(e) => {
                      setFinanceiro(e.target.checked);
                    }}
                  />
                }
                label="Financeiro"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rh}
                    onChange={(e) => {
                      setRh(e.target.checked);
                    }}
                  />
                }
                label="RH"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={comercial}
                    onChange={(e) => {
                      setComercial(e.target.checked);
                    }}
                  />
                }
                label="Comercial"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={contratos}
                    onChange={(e) => {
                      setContratos(e.target.checked);
                    }}
                  />
                }
                label="Contratos"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={retropatio}
                    onChange={(e) => {
                      setRetropatio(e.target.checked);
                    }}
                  />
                }
                label="Retropatio"
              />
            </FormGroup>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            startIcon={<Close />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              px: 2.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleEditUser}
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.35)",
              },
              "&:disabled": {
                backgroundColor: "grey.300",
                color: "grey.500",
              },
            }}
          >
            {loading ? "Criando..." : "Criar Usuário"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarUser;