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
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserAdService } from "../../../stores/adLdap/serviceUsersAd";

// Tipo para as opções do autocomplete (label = nome, value = dn)
type GroupOption = {
  label: string; // name (para exibição)
  value: string; // dn (usado no backend)
};

type UserOption = {
  label: string;
  value: string; // distinguishedName
  sAMAccountName?: string | null;
  mail?: string | null;
};

const DEFAULTS = {
  company: "",
  department: "",
  managerSamAccountName: "",
};

const ModalEditarUserAD = ({ item, showToast, setFlushHook }: any) => {
  const [open, setOpen] = useState(false);

  // grupos vindos do backend para o autocomplete
  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([]);

  // lista de DNs de grupos que vão ser enviados
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [company, setCompany] = useState(item.company);
  const [department, setDepartment] = useState(item.department);
  const [telephoneNumber, setTelephoneNumber] = useState(item.telephoneNumber);
  const [mail, setMail] = useState(item.mail);
  const [managerOptions, setManagerOptions] = useState<UserOption[]>([]);
  const [selectedManager, setSelectedManager] = useState<UserOption | null>(
    null,
  );

  const findDefaultManager = (options: UserOption[]) => {
    return (
      options.find(
        (m) =>
          (m.sAMAccountName || "").toLowerCase() ===
          DEFAULTS.managerSamAccountName.toLowerCase(),
      ) || null
    );
  };
  // garante que memberOf vire sempre string[]
  const normalizeMemberOf = (memberOf: any): string[] => {
    if (!memberOf) return [];
    if (Array.isArray(memberOf)) return memberOf;
    return [memberOf]; // caso venha como string única
  };

  const handleOpen = () => {
    setCompany(item.company || DEFAULTS.company);
    setDepartment(item.department || DEFAULTS.department);
    setTelephoneNumber(item.telephoneNumber || "");
    setMail(item.mail || "");
    setSelectedGroups(normalizeMemberOf(item.memberOf));
    setOpen(true);
  };

  useEffect(() => {
    if (!open || managerOptions.length === 0) return;

    // tenta manter o manager atual do usuário
    if (item.manager) {
      const managerFound = managerOptions.find((m) => m.value === item.manager);

      if (managerFound) {
        setSelectedManager(managerFound);
        return;
      }
    }

    // fallback para manager padrão
    const defaultManager = findDefaultManager(managerOptions);
    setSelectedManager(defaultManager);
  }, [open, item.manager, managerOptions]);

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
        sAMAccountName: item.sAMAccountName,
        telephoneNumber,
        mail,
        company,
        department,
        // managerDn: selectedManager?.value ?? null,
        targetGroupsDns: selectedGroups,
        managerSamAccountName: selectedManager?.sAMAccountName,
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

  const handleEnableUserAd = async () => {
    try {
      await UserAdService.enableUserAd({
        sAMAccountName: item.sAMAccountName,
      });
      showToast("Sucesso ao Ativar o Usuario pelo AD!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      showToast("Erro ao Ativar o Usuario pelo AD!", "error");
    } finally {
      handleClose();
    }
  };

  const handleDisableUserAd = async () => {
    try {
      await UserAdService.disableUserAd({
        sAMAccountName: item.sAMAccountName,
      });
      showToast("Sucesso ao Inativar o Usuario pelo AD!", "success");
      setFlushHook((prev: any) => !prev);
    } catch (error) {
      showToast("Erro ao Inativar o Usuario pelo AD!", "error");
    } finally {
      handleClose();
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await UserAdService.getGroupsUsersAd();
      const mapped: GroupOption[] = data.map((g: any) => ({
        label: g.name,
        value: g.dn,
      }));
      setGroupOptions(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await UserAdService.getAllUsersForManager();
      const mapped: UserOption[] = data.map((u: any) => ({
        label: u.label,
        value: u.value,
        sAMAccountName: u.sAMAccountName,
        mail: u.mail,
      }));
      setManagerOptions(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchManagers();
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
            mt: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleResetPasswordAndForceChange}
                sx={{ borderRadius: "10px" }}
              >
                Redefinir Senha
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Button
                variant="contained"
                color={item.isDisabled === true ? "success" : "error"}
                fullWidth
                onClick={
                  item.isDisabled === true
                    ? handleEnableUserAd
                    : handleDisableUserAd
                }
                sx={{ borderRadius: "10px" }}
              >
                {item.isDisabled === true ? "Ativar Conta" : "Inativar Conta"}
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                value={telephoneNumber}
                onChange={(e) => {
                  setTelephoneNumber(e.target.value);
                }}
                size="small"
                placeholder="Telephone Number"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                value={mail}
                onChange={(e) => {
                  setMail(e.target.value);
                }}
                size="small"
                placeholder="E-mail"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                }}
                size="small"
                placeholder="Company"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
                size="small"
                placeholder="Department"
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Autocomplete<UserOption, false, false, false>
                options={managerOptions}
                value={selectedManager}
                onChange={(_event, value) => {
                  setSelectedManager(value);
                }}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    placeholder="Selecione o manager"
                    InputProps={{
                      ...params.InputProps,
                      style: { borderRadius: "10px" },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* AutoComplete para adicionar grupos */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
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
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarUserAD;
