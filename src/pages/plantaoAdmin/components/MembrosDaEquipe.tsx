import { Add, Delete, Groups } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PlantaoService } from "../../../stores/plantao/service";
import { useEffect, useState } from "react";
import { useToast } from "../../../components/Toast";

type Area = "Sistemas" | "Infra";

const MembrosDaEquipe = () =>
  // { contatos, setContatos }: any
  {
    const { showToast } = useToast();

    const [contatos, setContatos] = useState<any[]>([]);

    const updateContato = <K extends keyof any>(
      index: number,
      field: K,
      value: any[K],
    ) => {
      setContatos((prev: any) =>
        prev.map((c: any, i: any) =>
          i === index ? { ...c, [field]: value } : c,
        ),
      );
    };

    const removeContato = (index: number) => {
      setContatos((prev: any) => prev.filter((_: any, i: any) => i !== index));
    };

    const addContato = () => {
      setContatos((prev: any) => [
        ...prev,
        { nome: "", telefone: "", area: "Sistemas" },
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

    const fetchData = async () => {
      try {
        const get = await PlantaoService.getAllPlantonistas();
        setContatos(get);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const handleUpdateMembrosEquipe = async () => {
      try {
        await PlantaoService.updateMembrosEquipe({
          contatos,
        });
        showToast("Sucesso ao Configurar Membros da Equipe", "success");
      } catch (error) {
        console.log(error);
        showToast("Erro ao Configurar Membros da Equipe", "error");
      }
    };

    return (
      <>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Groups sx={{ color: "primary.main" }} />
              Membros da Equipe
            </Typography>

            <Button
              variant="contained"
              onClick={handleUpdateMembrosEquipe}
              sx={{ borderRadius: "10px" }}
            >
              Atualizar
            </Button>
          </Box>
          <Stack spacing={2} mt={3}>
            {contatos.map((contato: any, index: any) => (
              <Stack
                key={contato.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <TextField
                  value={contato.nome}
                  onChange={(e) => updateContato(index, "nome", e.target.value)}
                  placeholder="Nome"
                  size="small"
                  sx={{ flex: 1 }}
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
                  placeholder="(99) 99999-9999"
                  size="small"
                  sx={{ width: 180 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
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
                  onClick={() => removeContato(index)}
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
        </Paper>
      </>
    );
  };

export default MembrosDaEquipe;
