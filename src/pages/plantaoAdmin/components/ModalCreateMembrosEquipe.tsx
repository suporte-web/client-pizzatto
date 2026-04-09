import { Add, Delete, People } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useState } from "react";
import { PlantaoService } from "../../../stores/plantao/service";
import { useToast } from "../../../components/Toast";

type Area = "Sistemas" | "Infra";

const ModalCreateMembrosEquipe = () => {
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [contatos, setContatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    await fetchData();
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const fetchData = async () => {
    try {
      const get = await PlantaoService.getAllPlantonistas();
      setContatos(get || []);
    } catch (error) {
      console.log(error);
      showToast("Erro ao carregar membros da equipe", "error");
    }
  };

  const updateContato = (index: number, field: string, value: any) => {
    setContatos((prev) =>
      prev.map((contato, i) =>
        i === index ? { ...contato, [field]: value } : contato,
      ),
    );
  };

  const handleDeleteMembro = async (id: string) => {
    try {
      await PlantaoService.deleteContatos({ id: id });
      showToast("Sucesso ao Deletar membro da equipe", "success");
    } catch (error) {
      console.log(error);
      showToast("Erro ao Deletar membro da equipe", "error");
    }
  };

  const addContato = () => {
    setContatos((prev) => [
      ...prev,
      { nome: "", telefone: "", area: "Sistemas" as Area },
    ]);
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleUpdateMembrosEquipe = async () => {
    try {
      setLoading(true);

      await PlantaoService.updateMembrosEquipe({
        contatos,
      });

      showToast("Sucesso ao configurar membros da equipe", "success");
      handleClose();
    } catch (error) {
      console.log(error);
      showToast("Erro ao configurar membros da equipe", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Configurar membros da equipe">
        <IconButton onClick={handleOpen} sx={{ bgcolor: blue[200] }}>
          <People />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Configurar Membros da Equipe</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Edite os membros da equipe, adicione novos contatos ou remova os
              existentes.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {contatos.map((contato, index) => (
              <Stack
                key={contato.id ?? index}
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  value={contato.nome}
                  onChange={(e) => updateContato(index, "nome", e.target.value)}
                  label="Nome"
                  placeholder="Nome"
                  size="small"
                  fullWidth
                />

                <TextField
                  value={contato.telefone}
                  onChange={(e) =>
                    updateContato(
                      index,
                      "telefone",
                      formatTelefone(e.target.value),
                    )
                  }
                  label="Telefone"
                  placeholder="(99) 99999-9999"
                  size="small"
                  sx={{ minWidth: { sm: 180 } }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Área</InputLabel>
                  <Select
                    value={contato.area}
                    label="Área"
                    onChange={(e) =>
                      updateContato(index, "area", e.target.value as Area)
                    }
                  >
                    <MenuItem value="Sistemas">Sistemas</MenuItem>
                    <MenuItem value="Infra">Infra</MenuItem>
                  </Select>
                </FormControl>

                <IconButton
                  onClick={() => handleDeleteMembro(contato.id)}
                  sx={{ color: "error.main" }}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addContato}
            fullWidth
            sx={{
              mt: 3,
              borderStyle: "dashed",
              borderWidth: 2,
              py: 1.5,
            }}
          >
            Adicionar Novo Membro
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>

          <Button
            onClick={handleUpdateMembrosEquipe}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateMembrosEquipe;
