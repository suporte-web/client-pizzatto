import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useState } from "react";
import { ToDoService } from "../../../stores/toDo/service";
import { UserContext } from "../../../UserContext";

const ModalEditarToDo = ({ item }: any) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState(item.nome || "");
  const [descricao, setDescricao] = useState(item.descricao || "");
  const [prazoLimite, setPrazoLimite] = useState(item.prazoLimite || "");
  const [responsavel, setResponsavel] = useState(item.responsavel || "");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateToDo = async () => {
    try {
      await ToDoService.update({
        _id: item._id,
        nome,
        descricao,
        prazoLimite,
        responsavel,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Tooltip title="Editar item A Fazer">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Item a Fazer</DialogTitle>
        <DialogContent>
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
                <TextField
                  label="Colaborador"
                  size="small"
                  value={responsavel}
                  onChange={(e) => {
                    setResponsavel(e.target.value);
                  }}
                  fullWidth
                  InputProps={{
                    sx: { borderRadius: "10px" },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
            }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateToDo}
            sx={{
              borderRadius: "10px",
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarToDo;
