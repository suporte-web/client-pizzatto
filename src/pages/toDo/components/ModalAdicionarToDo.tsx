import { Add } from "@mui/icons-material";
import {
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ToDoService } from "../../../stores/toDo/service";
import { UserContext } from "../../../UserContext";
import { UserService } from "../../../stores/users/service";

const ModalAdicionarToDo = ({ setFlushHook, showToast }: any) => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazoLimite, setPrazoLimite] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [users, setUsers] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNome("");
    setDescricao("");
    setPrazoLimite("");
    setResponsavel("");
  };

  const fetchUsers = async () => {
    try {
      const get = await UserService.getUsersAtivos();
      setUsers(get);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  const handleCreate = async () => {
    try {
      await ToDoService.create({
        nome,
        descricao,
        prazoLimite,
        responsavel: user?.acessos?.administrador ? responsavel : user?.nome,
      });
      showToast("Sucesso ao criar A Fazer!", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      showToast("Erro ao criar A Fazer!", "error");
      console.log(error);
    }
  };
  return (
    <>
      <Tooltip title="Adicionar A Fazer">
        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.12),
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: alpha(theme.palette.info.main, 0.3),
              transform: "scale(1.08)",
            },
            width: 46,
            height: 46,
            boxShadow: 2,
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 1,
            background: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          Criar A Fazer
        </DialogTitle>

        <DialogContent dividers sx={{ borderRadius: "14px" }}>
          <Grid container spacing={2} mt={0.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nome"
                size="small"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                }}
                fullWidth
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descrição"
                size="small"
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value);
                }}
                fullWidth
                multiline
                rows={3}
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: user?.acessos?.administrador ? 6 : 12 }}>
              <TextField
                type="date"
                label="Prazo Limite"
                size="small"
                value={prazoLimite}
                onChange={(e) => {
                  setPrazoLimite(e.target.value);
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { borderRadius: "10px" },
                }}
              />
            </Grid>

            {user?.acessos?.administrador && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Colaborador</InputLabel>
                  <Select
                    value={responsavel}
                    label="Colaborador"
                    onChange={(e) => {
                      setResponsavel(e.target.value);
                    }}
                    sx={{ borderRadius: "10px" }}
                  >
                    {users.map((item: any) => (
                      <MenuItem value={item.nome}>{item.nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
            }}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreate}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              boxShadow: 3,
              "&:hover": {
                boxShadow: 5,
              },
            }}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalAdicionarToDo;
