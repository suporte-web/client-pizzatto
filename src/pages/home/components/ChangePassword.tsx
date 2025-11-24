import React from "react";
import {
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
  LockOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Fade,
  LinearProgress,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../../../UserContext";
import { useToast } from "../../../components/Toast";
import { UserService } from "../../../stores/users/service";

interface InputChangePasswordProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  showStrength?: boolean;
}

const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[\W_]/.test(password)) strength += 1;
  return strength;
};

const getStrengthColor = (strength: number) => {
  if (strength <= 2) return "#f44336";
  if (strength <= 3) return "#ff9800";
  if (strength <= 4) return "#2196f3";
  return "#4caf50";
};

const getStrengthText = (strength: number) => {
  if (strength <= 2) return "Fraca";
  if (strength <= 3) return "Média";
  if (strength <= 4) return "Boa";
  return "Forte";
};

const InputChangePassword = ({
  value,
  setValue,
  label,
  showStrength = false,
}: InputChangePasswordProps) => {
  const [seeSenha, setSeeSenha] = useState(false);
  const strength = getPasswordStrength(value);

  const handleToggleSenhaVisibility = () => {
    setSeeSenha(!seeSenha);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <TextField
        placeholder={label}
        size="small"
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              border: "1px solid rgba(25, 118, 210, 0.5)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 20px rgba(25, 118, 210, 0.1)",
            },
            "&.Mui-focused": {
              border: "1px solid #1976d2",
              boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
            },
          },
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={seeSenha ? "text" : "password"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleToggleSenhaVisibility}>
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
      />
      {showStrength && value && (
        <Fade in={true}>
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={(strength / 5) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getStrengthColor(strength),
                  borderRadius: 2,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: getStrengthColor(strength),
                fontWeight: 500,
                mt: 0.5,
                display: "block",
              }}
            >
              Força da senha: {getStrengthText(strength)}
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

const ChangePassword = () => {
  const { user, setUser }: any = useContext(UserContext);

  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const { showToast } = useToast();

  const passouTrocaSenha = () => {
    const dataTrocarSenha =
      user?.dataAtualizacaoPassword <= moment().format("YYYY-MM-DD");
    return dataTrocarSenha;
  };

  const handleUpdateSenha = async () => {
    try {
      if (senha !== confirmarSenha) {
        showToast("Senhas não conferem", "error");
        return;
      }
      if (senha.length < 7 && confirmarSenha.length < 7) {
        showToast("Senha deve conter no minimo 8 caracteres", "error");
        return;
      }

      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
      if (!regex.test(senha)) {
        showToast(
          "Senha deve conter no minimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caracter especial",
          "error"
        );

        return;
      }
      const futureDate = moment().add(3, "months").format("YYYY-MM-DD");

      await UserService.updateSenha({
        _id: user._id, 
        senha1: senha,
        senha2: confirmarSenha,
        primeiroAcesso: false,
        dataAtualizacaoPassword: futureDate,
      });
      setUser({ ...user, primeiroAcesso: false });
      showToast("Senha atualizada com sucesso", "success");
    } catch (error) {
      console.log(error);
      showToast("Erro ao atualizar senha", "error");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const result = await UserService.findOne(user._id);
      console.log(result);
      setPrimeiroAcesso(result.primeiroAcesso);
    };
    fetch();
  }, [user]);

  return (
    (primeiroAcesso || passouTrocaSenha()) && (
      <Fade in={true} timeout={800}>
        <Card
          sx={{
            maxWidth: 500,
            mx: "auto",
            mt: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)",
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                }}
              >
                <SecurityOutlined sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                Definir Nova Senha
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  textAlign: "center",
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                Para sua segurança, é necessário criar uma nova senha forte e
                segura
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <InputChangePassword
                value={senha}
                setValue={setSenha}
                label="Nova Senha"
                showStrength={true}
              />
              <InputChangePassword
                value={confirmarSenha}
                setValue={setConfirmarSenha}
                label="Confirmar Senha"
              />

              <Button
                type="submit"
                onClick={handleUpdateSenha}
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(25, 118, 210, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Atualizar Senha
              </Button>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "rgba(25, 118, 210, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(0, 0, 0, 0.7)",
                    display: "block",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  💡 Sua senha deve conter no mínimo 8 caracteres, incluindo:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    display: "block",
                    textAlign: "center",
                    mt: 0.5,
                  }}
                >
                  • 1 letra maiúscula • 1 letra minúscula • 1 número • 1
                  caractere especial
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    )
  );
};

export default ChangePassword;