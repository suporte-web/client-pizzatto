import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  type SelectChangeEvent,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useState } from "react";
import { CalendarioService } from "../../../stores/calendario/service";
import { useToast } from "../../../components/Toast";

const ModalCreateCalendario = ({ setFlushHook, departamentos }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>(
    [],
  );
  const [descricao, setDescricao] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNome("");
    setData("");
    setHorario("");
    setLocal("");
    setSelectedDepartamentos([]);
    setDescricao("");
  };

  // const filiaisReais = useMemo(
  //   () =>
  //     departamentos
  //       .filter((filial: any) => filial.value !== "todos")
  //       .map((filial: any) => filial.value),
  //   [],
  // );

  const handleChangeDepartamentos = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];

    if (value.includes("todos")) {
      if (allSelected) {
        // desmarca tudo
        setSelectedDepartamentos([]);
      } else {
        // seleciona todos
        setSelectedDepartamentos(departamentos);
      }
    } else {
      setSelectedDepartamentos(value);
    }
  };

  const allSelected =
    departamentos.length > 0 &&
    selectedDepartamentos.length === departamentos.length;

  const handleCreate = async () => {
    try {
      await CalendarioService.create({
        nome,
        data,
        horario,
        local,
        departamento: selectedDepartamentos,
        descricao,
      });
      showToast("Sucesso ao criar Calendário", "success");
      setFlushHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar Calendário", "error");
    }
  };

  return (
    <>
      <Tooltip title="Criar ">
        <IconButton onClick={handleOpen} sx={{ bgcolor: orange[200] }}>
          <Add />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar ao Calendário</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              mb: 1,
            }}
          >
            <TextField
              type="text"
              label="Nome do Evento"
              size="small"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            <TextField
              type="date"
              label="Data do Evento"
              size="small"
              fullWidth
              value={data}
              onChange={(e) => setData(e.target.value)}
              InputProps={{ style: { borderRadius: "10px" } }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="Horario do Evento"
              size="small"
              fullWidth
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              InputProps={{ style: { borderRadius: "10px" } }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="text"
              label="Local do Evento"
              size="small"
              fullWidth
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              InputProps={{ style: { borderRadius: "10px" } }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="filiais-label">
                Departamento Participante do Evento
              </InputLabel>
              <Select
                labelId="filiais-label"
                multiple
                value={selectedDepartamentos}
                onChange={handleChangeDepartamentos}
                input={
                  <OutlinedInput label="Departamento Participante do Evento" />
                }
                renderValue={() =>
                  allSelected
                    ? "Todos os Departamentos"
                    : selectedDepartamentos.join(", ")
                }
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="todos">
                  <Checkbox checked={allSelected} size="small" />
                  <ListItemText primary="Todos" />
                </MenuItem>
                {departamentos.map((depart: any) => {
                  const checked = selectedDepartamentos.includes(depart);

                  return (
                    <MenuItem key={depart} value={depart}>
                      <Checkbox checked={checked} size="small" />
                      <ListItemText primary={depart} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              type="text"
              multiline
              rows={3}
              label="Descrição do Evento"
              size="small"
              fullWidth
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              InputProps={{ style: { borderRadius: "10px" } }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
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

export default ModalCreateCalendario;
