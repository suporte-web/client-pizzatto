import { Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserAdService } from "../../../stores/usersAd/service";

// Tipo para as opções do autocomplete (label = nome, value = dn)
type GroupOption = {
  label: string; // name (para exibição)
  value: string; // dn (usado no backend)
};

// só para fins VISUAIS (nunca usar isso no DN!)
// const removeAccents = (text: string) =>
//   text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ModalEditarUserAD = ({ item, showToast, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);

  // grupos vindos do backend para o autocomplete
  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([]);

  // lista de DNs de grupos que vão ser enviados
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // garante que memberOf vire sempre string[]
  const normalizeMemberOf = (memberOf: any): string[] => {
    if (!memberOf) return [];
    if (Array.isArray(memberOf)) return memberOf;
    return [memberOf]; // caso venha como string única
  };

  const handleOpen = () => {
    setOpen(true);
    console.log("Usuário:", item);
    console.log("item.distinguishedName:", item.distinguishedName);
    console.log("item.dn:", item.dn);
    console.log("item.memberOf:", item.memberOf);

    const initialGroups = normalizeMemberOf(item.memberOf);
    setSelectedGroups(initialGroups);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAutocompleteChange = (_event: any, value: GroupOption | null) => {
    if (!value) return;

    const groupDn = value.value; // DN do grupo

    // evita duplicados
    const alreadySelected = selectedGroups.includes(groupDn);
    if (alreadySelected) return;

    setSelectedGroups((prev) => [...prev, groupDn]);
  };

  const handleRemoveGroup = (groupDn: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g !== groupDn));
  };

  const handleEditar = async () => {
    try {
      await UserAdService.update({
        // posso até ignorar o dn que veio do front, vamos confiar no login
        sAMAccountName: item.sAMAccountName,
        targetGroupsDns: selectedGroups, // DNs dos grupos
      });
      showToast("Sucesso ao Editar Usuario do AD!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      showToast("Erro ao Editar Usuario do AD!", "error");
    } finally {
      handleClose();
    }
  };

  const handleResetPasswordAndForceChange = async () => {
    try {
      await UserAdService.resetPasswordAndForceChange({
        sAMAccountName: item.sAMAccountName,
      });
      showToast("Sucesso ao Resetar senha do Usuario pelo AD!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      showToast("Erro ao Resetar senha do Usuario pelo AD!", "error");
    } finally {
      handleClose();
    }
  };

  const fetchData = async () => {
    try {
      const data = await UserAdService.getGroupsUsersAd();
      // data esperado: [{ name: string, dn: string }, ...]
      const mapped: GroupOption[] = data.map((g: any) => ({
        // aqui você pode optar por exibir com ou sem acento
        label: g.name, // ou removeAccents(g.name) se quiser exibir sem acento
        value: g.dn,
      }));
      setGroupOptions(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Tooltip title="Editar Usuario AD">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario do Active Directory</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleResetPasswordAndForceChange}
            sx={{ borderRadius: "10px" }}
          >
            Redefinir Senha
          </Button>

          {/* AutoComplete para adicionar grupos */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle2">Adicionar grupo:</Typography>

            <Autocomplete<GroupOption, false, false, false>
              options={groupOptions}
              getOptionLabel={(option) => option.label}
              // não mantém o valor selecionado, usa só para disparar o onChange
              value={null}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Digite para buscar um grupo"
                />
              )}
            />

            {/* Grupos selecionados */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Grupos selecionados:
              </Typography>

              {selectedGroups.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum grupo selecionado.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {selectedGroups.map((groupDn) => {
                    const group = groupOptions.find((g) => g.value === groupDn);

                    const label = group?.label || groupDn;

                    return (
                      <Chip
                        key={groupDn}
                        // se quiser exibir sem acento na UI:
                        // label={removeAccents(label)}
                        label={label}
                        onDelete={() => handleRemoveGroup(groupDn)}
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
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
            onClick={handleEditar}
            disabled={selectedGroups.length === 0}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarUserAD;
