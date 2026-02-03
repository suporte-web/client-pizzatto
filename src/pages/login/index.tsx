import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
  type ContainerProps,
} from "@mui/material";
import {
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { loginUser } from "../../stores/auth/service";
import pizzatto50AnosImage from "../../imgs/pizzatto 50 anos.jpg";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const containerProps: ContainerProps = {
    maxWidth: false,
    sx: {
      background: `url(${pizzatto50AnosImage})`,
      backgroundSize: "contain",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 2 : 0,
      position: "relative",
    },
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [seeSenha, setSeeSenha] = useState(false);
  const [changeVisualizarSenha, setChangeVisualizarSenha] =
    useState<"password" | "text">("password");

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await loginUser({ email, senha });
      localStorage.setItem("token", token);
      showToast("Login com sucesso", "success");
      window.location.replace(`/home`);
    } catch (error) {
      showToast("Erro ao fazer login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSenhaVisibility = () => {
    setSeeSenha(!seeSenha);
    setChangeVisualizarSenha(seeSenha ? "password" : "text");
  };

  return (
    <Container {...containerProps}>
      {/* 🔥 BOTÃO PLANTÃO TI FIXO */}
      <Box
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1300,
        }}
      >
        <Button
          component={Link}
          href="/plantao/page-principal"
          variant="contained"
          color="error"
          sx={{
            borderRadius: "999px",
            px: 3,
            py: 1.2,
            fontWeight: 800,
            textTransform: "none",
            fontSize: "0.95rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.08)" },
              "100%": { transform: "scale(1)" },
            },
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
            },
          }}
        >
          🚨 Plantão TI
        </Button>
      </Box>

      <Grid container justifyContent="center" alignItems="center">
        <Box
          component={Paper}
          elevation={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,77,0, 0.46)",
            padding: 4,
            borderRadius: "16px",
            width: isMobile ? "100%" : 400,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.secondary.main,
              mb: 3,
            }}
          >
            Gestor de Contratos
          </Typography>

          <form style={{ width: "100%" }}>
            <TextField
              type="email"
              label="E-mail"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: {
                  borderRadius: "12px",
                  height: 48,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />

            <TextField
              label="Senha"
              fullWidth
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type={changeVisualizarSenha}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleSenhaVisibility}>
                      {changeVisualizarSenha === "password" ? (
                        <Tooltip title="Ver senha">
                          <RemoveRedEyeOutlined />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Ocultar senha">
                          <VisibilityOffOutlined />
                        </Tooltip>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "12px",
                  height: 48,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                mb: 2,
                borderRadius: "12px",
                height: 48,
                fontWeight: 600,
                textTransform: "none",
              }}
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading && <CircularProgress size={20} />}
            >
              Entrar
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component="button"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Esqueci minha senha
              </Link>
            </Box>
          </form>
        </Box>
      </Grid>
    </Container>
  );
};

export default Login;
