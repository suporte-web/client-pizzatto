import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

const ModalEditarUserAD = (
  // { item }: any
) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(true);
  };
  return (
    <>
      <Tooltip title="Editar Usuario AD">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Usuario do Active Directory</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection:'column', gap: 2}}>
          <Button variant="contained" sx={{ borderRadius: "10px" }}>
            Redefinir Senha
          </Button>
          <Select>
            <MenuItem value="teste">teste</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={handleClose}
            sx={{ borderRadius: "10px" }}
          >
            Fechar
          </Button>
          <Button
            color="success"
            variant="contained"
            sx={{ borderRadius: "10px" }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarUserAD;
