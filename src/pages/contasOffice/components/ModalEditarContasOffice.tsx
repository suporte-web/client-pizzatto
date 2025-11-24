import { Edit } from "@mui/icons-material";
import {
    alpha,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { ContaOfficeService } from "../../../stores/contasOffice/service";

const ModalEditarContasOffice = ({ item, setFlushHook, showToast }: any) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [nome, setNome] = useState(item.nome);
  const [email, setEmail] = useState(item.email);
  const [senha, setSenha] = useState(item.senha);
  const [ativo, setAtivo] = useState(item.ativo);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      await ContaOfficeService.update({
        _id: item._id,
        nome,
        email,
        senha,
        ativo,
      });
      setFlushHook((prev: any) => !prev);
      showToast("Sucesso ao editar Contas!", "success");
    } catch (error) {
      console.log(error);
      showToast("Erro ao editar Contas!", "error");
    }
  };
  return (
    <>
      <Tooltip title="Editar Contas Office">
        <IconButton
          onClick={handleOpen}
          color={"info"}
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            "&:hover": {
              backgroundColor: alpha(theme.palette.info.main, 0.3),
            },
            width: 46,
            height: 46,
          }}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Editar Contas Office</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <TextField
              label="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ativo}
                  onChange={() => {
                    setAtivo(!ativo);
                  }}
                  color="primary"
                  size="small"
                  sx={{ borderRadius: "10px" }}
                />
              }
              label="Conta Ativa"
            />
            {/* Se quiser, pode adicionar mais campos, ex: licença, departamento, etc. */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Fechar
          </Button>

          <Button
            onClick={handleUpdate}
            variant="contained"
            color="success"
            sx={{ textTransform: "none", borderRadius: "10px" }}
            disabled={!nome || !email}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarContasOffice;
