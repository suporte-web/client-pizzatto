import {
  Edit,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

const ModalEditarInventarioImpressoras = ({ item }: any) => {
  const [seeSenha, setSeeSenha] = useState(false);

  const handleToggleSenhaVisibility = () => {
    setSeeSenha(!seeSenha);
  };
  const [open, setOpen] = useState(false);

  const [filial, setFilial] = useState(item.filial);
  const [marca, setMarca] = useState(item.marca);
  const [modelo, setModelo] = useState(item.modelo);
  const [numeroSerie, setNumeroSerie] = useState(item.numeroSerie);
  const [ip, setIp] = useState(item.ip);
  const [macLan, setMacLan] = useState(item.macLan);
  const [macWlan, setMacWlan] = useState(item.macWlan);
  const [localizacao, setLocalizacao] = useState(item.localizacao);
  const [senhaAdministrador, setSenhaAdministrador] = useState(
    item.senhaAdministrador
  );
  const [etiqueta, setEtiqueta] = useState(item.etiqueta);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Editar Inventário de Impressoras">
        <IconButton onClick={handleOpen}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Inventário de Impressoras</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Filial"
                fullWidth
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Marca"
                fullWidth
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Modelo"
                fullWidth
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Número de Série"
                fullWidth
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="IP"
                fullWidth
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="MAC LAN"
                fullWidth
                value={macLan}
                onChange={(e) => setMacLan(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="MAC WLAN"
                fullWidth
                value={macWlan}
                onChange={(e) => setMacWlan(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Localização"
                fullWidth
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Senha do Administrador"
                type={seeSenha ? "text" : "password"}
                fullWidth
                value={senhaAdministrador}
                onChange={(e) => setSenhaAdministrador(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleToggleSenhaVisibility}
                      >
                        {seeSenha ? (
                          <Tooltip title="Esconder senha">
                            <VisibilityOffOutlined />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Verificar senha">
                            <RemoveRedEyeOutlined />
                          </Tooltip>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size="small"
                label="Etiqueta"
                fullWidth
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                InputLabelProps={{
                  sx: { fontSize: "0.875rem" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            sx={{ borderRadius: "10px" }}
          >
            Fechar
          </Button>
          <Button
            onClick={handleClose}
            sx={{ borderRadius: "10px" }}
            variant="contained"
            color="success"
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalEditarInventarioImpressoras;
