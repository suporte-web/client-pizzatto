import {
  alpha,
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  type ContainerProps,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import SidebarNew from "../../../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import { ContratosService } from "../../../stores/contrato/serviceContratos";
import EditarControleContratos from "./components/EditarControleContratos";
import {
  Edit,
  EditOff,
  Business,
  Person,
  Description,
  PictureAsPdf,
} from "@mui/icons-material";
import { UserContext } from "../../../UserContext";
import ModalPromptGeradorClausulas from "./components/ModalPromptGeradorClausulasContrato";
import moment from "moment";

// Estilos melhorados
const cardStyle = (theme: any) => ({
  borderRadius: "16px",
  padding: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "all 0.3s ease-in-out",
  height: "100%",
  "&:hover": {
    boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
    transform: "translateY(-2px)",
  },
});

const headerStyle = (theme: any) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  padding: "20px 24px",
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
});

const valueStyle = {
  fontWeight: 600,
  color: "text.primary",
  fontSize: "0.9rem",
};

const labelStyle = {
  fontWeight: 500,
  color: "text.secondary",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const ControleContratos = () => {
  const { user } = useContext(UserContext);
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const params = useParams();
  const { showToast } = useToast();
  const theme = useTheme();
  const [flushHook, setFlushHook] = useState(false);

  const [contrato, setContrato] = useState<any>({});
  const [editarContrato, setEditarContrato] = useState<any>(false);

  const handleContrato = async () => {
    try {
      const get = await ContratosService.findById(params._id);
      setContrato(get);
    } catch (error) {
      showToast("Erro ao encontrar o Contrato!", "error");
    }
  };

  const handleAssumirContrato = async () => {
    try {
      await ContratosService.update({
        _id: params._id,
        responsavel: user?.nome,
      });
      showToast("Contrato assumido com sucesso!", "success");
      setFlushHook(!flushHook);
    } catch (error) {
      showToast("Erro ao encontrar o Contrato!", "error");
    }
  };

  const handleGerarContrato = async () => {
    try {
      console.log("Iniciando geração de PDF...");

      const response = await ContratosService.createPdfContrato({
        _id: params._id,
        usuario: user?.nome,
      });

      console.log("Response recebido:", response);

      // Verificar se a resposta é válida
      if (!response) {
        throw new Error("Resposta vazia do servidor");
      }

      // Criar Blob a partir da resposta
      const pdfBlob = new Blob([response], {
        type: "application/pdf",
      });

      // Verificar se o Blob é válido
      if (pdfBlob.size === 0) {
        throw new Error("Arquivo PDF vazio");
      }

      handleDownload(pdfBlob);
    } catch (error) {
      console.error("Erro detalhado ao baixar PDF:", error);
      showToast("Erro ao gerar Contrato!", "error");
    }
  };

  const handleDownload = (blob: Blob) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `contrato-${params._id || "sem-id"}.pdf`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Limpeza
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    showToast("Contrato gerado com sucesso!", "success");
    setFlushHook(!flushHook);
  };

  useEffect(() => {
    handleContrato();
  }, [flushHook]);

  const entidade = contrato?.cliente || contrato?.fornecedor;
  const filial = contrato?.filial;

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  // Função para renderizar chips de status
  const renderStatusChip = (status: string) => {
    const statusColors: any = {
      INICIADO: "info",
      "EM NEGOCIACAO": "warning",
      "AGUARDANDO ASSINATURA": "primary",
      ATIVO: "success",
      CANCELADO: "error",
      EXPIRADO: "error",
    };

    return <Chip label={status} color={statusColors[status]} size="small" />;
  };

  return (
    <SidebarNew title={`Controle do Contrato: ${params._id}`}>
      <Container {...containerProps}>
        {editarContrato ? (
          <EditarControleContratos
            contrato={contrato}
            entidade={entidade}
            showToast={showToast}
            setEditarContrato={setEditarContrato}
            editarContrato={editarContrato}
            setFlushHook={setFlushHook}
          />
        ) : (
          <>
            {!["CANCELADO", "EXPIRADO"].includes(contrato?.status) && (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Tooltip title={"Editar Contrato"}>
                  <IconButton
                    color={"primary"}
                    onClick={() => setEditarContrato(!editarContrato)}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      width: 56,
                      height: 56,
                    }}
                  >
                    {editarContrato ? <EditOff /> : <Edit />}
                  </IconButton>
                </Tooltip>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <ModalPromptGeradorClausulas contrato={contrato} />
                  <Tooltip title={"Gerar Contrato"}>
                    <IconButton
                      color={"error"}
                      onClick={handleGerarContrato}
                      sx={{
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.3),
                        },
                        width: 56,
                        height: 56,
                      }}
                    >
                      {<PictureAsPdf />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Assumir Contrato"}>
                    <IconButton
                      color={"info"}
                      onClick={handleAssumirContrato}
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.info.main, 0.3),
                        },
                        width: 56,
                        height: 56,
                      }}
                    >
                      {<Person />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            <Grid container spacing={1}>
              {/* 🟦 Card Informações do Contrato */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={cardStyle(theme)}>
                  <Box sx={headerStyle(theme)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Description color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Informações do Contrato
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {[
                        { label: "Contrato", value: contrato.contrato },
                        { label: "Contas", value: contrato.contas },
                        {
                          label: "Status",
                          value: contrato.status,
                          component: renderStatusChip(contrato.status),
                        },
                        {
                          label: "Data Inicio Fidelidade",
                          value: contrato.dataInicioFidelidade && moment(contrato.dataInicioFidelidade).format('DD/MM/YYYY'),
                        },
                        {
                          label: "Data Final Fidelidade",
                          value: contrato.dataFinalFidelidade && moment(contrato.dataFinalFidelidade).format('DD/MM/YYYY'),
                        },
                        {
                          label: "Valor Restante",
                          value: formatCurrency(contrato.valorRestante),
                        },
                        {
                          label: "Valor Total",
                          value: formatCurrency(contrato.valor),
                        },
                        { label: "Responsável", value: contrato.responsavel },
                        {
                          label: "Índice de Reajuste",
                          value: contrato.indiceReajuste,
                        },
                        {
                          label: "Risco",
                          value: contrato.risco,
                          component: contrato.risco && (
                            <Chip
                              label={contrato.risco}
                              color={
                                contrato.risco === "ALTO"
                                  ? "error"
                                  : contrato.risco === "MÉDIO OU MODERADO"
                                  ? "warning"
                                  : contrato.risco === "BAIXO"
                                  ? "success"
                                  : "info"
                              }
                              size="small"
                            />
                          ),
                        },
                        {
                          label: "Data de Assinatura",
                          value: contrato.dataAssinatura && moment(contrato.dataAssinatura).format('DD/MM/YYYY'),
                        },
                      ].map((item, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                          <Stack spacing={0.5}>
                            <Typography sx={labelStyle}>
                              {item.label}
                            </Typography>
                            {item.component || (
                              <Typography sx={valueStyle}>
                                {item.value || "-"}
                              </Typography>
                            )}
                          </Stack>
                          <Divider sx={{ mt: 1.5 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* 🟩 Parte Contratado */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={cardStyle(theme)}>
                  <Box sx={headerStyle(theme)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Person color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Parte Contratada
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {[
                        { label: "Nome", value: entidade?.nome },
                        { label: "Parte", value: entidade?.parte },
                        { label: "CPF", value: entidade?.cpf },
                        { label: "Nascimento", value: entidade?.nascimento },
                        { label: "Contato", value: entidade?.contato },
                        { label: "CNPJ", value: entidade?.cnpj },
                        { label: "Email", value: entidade?.email },
                        { label: "Telefone", value: entidade?.telefone },
                        { label: "CEP", value: entidade?.cep },
                        {
                          label: "Cidade/Estado",
                          value:
                            entidade?.cidade && entidade?.uf
                              ? `${entidade.cidade}/${entidade.uf}`
                              : undefined,
                        },
                        { label: "Bairro", value: entidade?.bairro },
                        {
                          label: "Endereço",
                          value:
                            entidade?.rua && entidade?.numero
                              ? `${entidade.rua}, ${entidade.numero}`
                              : undefined,
                        },
                        { label: "Sala", value: entidade?.sala },
                        { label: "Complemento", value: entidade?.complemento },
                        {
                          label: "Representante Legal",
                          value: entidade?.representanteLegal,
                        },
                      ].map((item, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                          <Stack spacing={0.5}>
                            <Typography sx={labelStyle}>
                              {item.label}
                            </Typography>
                            <Typography sx={valueStyle}>
                              {item.value || "-"}
                            </Typography>
                          </Stack>
                          <Divider sx={{ mt: 1.5 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* 🟧 Filial */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={cardStyle(theme)}>
                  <Box sx={headerStyle(theme)}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Business color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Filial
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {[
                        {
                          label: "Filial",
                          value: filial?.filial,
                        },
                        {
                          label: "CNPJ",
                          value: filial?.cnpj,
                        },
                        {
                          label: "Representante Legal",
                          value: filial?.representanteLegal,
                        },
                        {
                          label: "CEP",
                          value: filial?.cep,
                        },
                        {
                          label: "Cidade/Estado",
                          value:
                            filial?.cidade && filial?.uf
                              ? `${filial.cidade}/${filial.uf}`
                              : undefined,
                        },
                        {
                          label: "Bairro",
                          value: filial?.bairro,
                        },
                        {
                          label: "Endereço",
                          value:
                            filial?.rua && filial?.numero
                              ? `${filial.rua}, ${filial.numero}`
                              : undefined,
                        },
                        {
                          label: "Sala",
                          value: filial?.sala,
                        },
                        {
                          label: "Complemento",
                          value: filial?.complemento,
                        },
                      ].map((item, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                          <Stack spacing={0.5}>
                            <Typography sx={labelStyle}>
                              {item.label}
                            </Typography>
                            <Typography sx={valueStyle}>
                              {item.value || "-"}
                            </Typography>
                          </Stack>
                          <Divider sx={{ mt: 1.5 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </SidebarNew>
  );
};

export default ControleContratos;
