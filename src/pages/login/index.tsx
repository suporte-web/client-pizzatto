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
import pizzattoImage from "../../imgs/PizzattoLog_logo.png";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const containerProps: ContainerProps = {
    maxWidth: false,
    sx: {
      background: `url(${pizzattoImage}) no-repeat center center, linear-gradient(70deg, rgba(255,255,255,0.6) 10%, rgba(255,77,0,0.6) 100%)`,
      backgroundSize: "contain",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 2 : 0,
    },
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [seeSenha, setSeeSenha] = useState(false);
  const [changeVisualizarSenha, setChangeVisualizarSenha] = useState<
    "password" | "text"
  >("password");

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await loginUser({ email, senha });
      setLoading(false);
      console.log(token);

      localStorage.setItem("token", token);
      showToast("Login com sucesso", "success");
      window.location.replace(`/home`);
    } catch (error: any) {
      console.log(error);
      showToast("Erro ao fazer login", "error");
      setLoading(false);
    }
  };

  const handleToggleSenhaVisibility = () => {
    setSeeSenha(!seeSenha);
    setChangeVisualizarSenha(seeSenha ? "password" : "text");
  };

  return (
    <Container {...containerProps}>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        <Box
          component={Paper}
          elevation={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.75)",
            padding: 4,
            borderRadius: "16px",
            width: isMobile ? "100%" : 400,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 3,
            }}
          >
            Acesse sua conta
          </Typography>

          <form style={{ width: "100%" }}>
            <TextField
              type="email"
              label="E-mail"
              variant="outlined"
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
              variant="outlined"
              fullWidth
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type={changeVisualizarSenha}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleToggleSenhaVisibility}
                      edge="end"
                    >
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
                fontSize: "1rem",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading && <CircularProgress size={"20px"} />}
            >
              Entrar
            </Button>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    textDecoration: "underline",
                    color: theme.palette.primary.dark,
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
