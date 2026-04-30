import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { MuralService } from "../../../../stores/mural/service";
import { Delete } from "@mui/icons-material";
import { red } from "@mui/material/colors";

const ModalDeleteMural = ({ muralId, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await MuralService.delete(muralId);

      setFlushHook((prev: any) => !prev); // 🔥 força reload
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Deletar">
        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: red[400],
            color: "#fff",
            transition: "0.2s",

            "&:hover": {
              backgroundColor: red[700],
              transform: "scale(1.05)",
            },
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar exclusão</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar este mural? Essa ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>

          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? "Deletando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDeleteMural;
