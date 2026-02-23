import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Avatar,
    Paper,
    alpha,
    useTheme,
    Stack,
} from "@mui/material";
import {
    Phone,
    AccessTime,
    Person,
    Computer,
    Storage,
    CheckCircle,
    CalendarToday,
    ArrowBack,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { usePlantaoData } from "../../../hooks/use-plantao-data";
import bgPlantao from '../../../imgs/bg-plantao.jpg';
import LogoPizzatto from '../../../imgs/image.png';

export default function PlantaoPagePrincipal() {
    const theme = useTheme();
    const { contatos, escalaSistemas, escalaInfra, janelaSistemas, janelaInfra } = usePlantaoData();
    const [agora, setAgora] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setAgora(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"] as const;
    const diaSemanaIndex = agora.getDay();
    const diaSemanaChave = diasSemana[diaSemanaIndex];

    const horaAtualStr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const dataHojeFormatada = agora.toLocaleDateString("pt-BR", {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const verificarSeEstaAtivo = (inicio: string, fim: string) => {
        const [hAtu, mAtu] = horaAtualStr.split(":").map(Number);
        const [hIni, mIni] = inicio.split(":").map(Number);
        const [hFim, mFim] = fim.split(":").map(Number);
        const totalAtu = hAtu * 60 + mAtu;
        const totalIni = hIni * 60 + mIni;
        const totalFim = hFim * 60 + mFim;

        if (totalIni > totalFim) {
            return totalAtu >= totalIni || totalAtu <= totalFim;
        }
        return totalAtu >= totalIni && totalAtu <= totalFim;
    };

    // === LÓGICA SISTEMAS ===
    const isFimDeSemana = diaSemanaIndex === 0 || diaSemanaIndex === 6;

    // Verifica se está no horário de Sistemas (conforme Admin)
    const isHorarioSistemas = verificarSeEstaAtivo(janelaSistemas.inicio, janelaSistemas.fim);
    const isPlantaoAtivoSis = isFimDeSemana || isHorarioSistemas;

    const nomeSistemas = escalaSistemas[diaSemanaChave];
    const plantonistaSis = contatos.find(c => c.nome === nomeSistemas);

    // === LÓGICA INFRA ===
    const isHorarioInfra = verificarSeEstaAtivo(janelaInfra.inicio, janelaInfra.fim);
    const isPlantaoAtivoInfra = isFimDeSemana || isHorarioInfra;

    const nomeInfra = escalaInfra[diaSemanaChave];
    const plantonistaInfra = contatos.find(c => c.nome === nomeInfra);

    const PlantaoCard = ({
        titulo,
        icon: Icon,
        plantonista,
        ativo,
        corBorda,
        corIcone
    }: {
        titulo: string;
        icon: any;
        plantonista: any;
        ativo: boolean;
        corBorda: string;
        corIcone: string;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ flex: 1 }}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: '100%',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 3,
                        background: ativo
                            ? `radial-gradient(circle at center, ${alpha(corBorda, 0.2)} 0%, transparent 70%)`
                            : 'transparent',
                        filter: 'blur(40px)',
                        zIndex: 0,
                    }
                }}
            >
                <Card
                    sx={{
                        height: '100%',
                        borderTop: 4,
                        borderColor: corBorda,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        boxShadow: theme.shadows[8],
                        position: 'relative',
                        zIndex: 1,
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Icon sx={{ color: corIcone, fontSize: 20 }} />
                                    <Typography variant="caption" sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        color: 'text.secondary'
                                    }}>
                                        {titulo}
                                    </Typography>
                                </Stack>

                                {ativo ? (
                                    <Chip
                                        icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                        label="ATIVO"
                                        sx={{
                                            backgroundColor: theme.palette.success.main,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            boxShadow: theme.shadows[1],
                                        }}
                                        size="small"
                                    />
                                ) : (
                                    <Chip
                                        icon={<CalendarToday sx={{ fontSize: 16 }} />}
                                        label="FORA DE HORÁRIO"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            borderColor: alpha(theme.palette.text.secondary, 0.2),
                                            color: 'text.secondary',
                                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                                        }}
                                    />
                                )}
                            </Box>

                            <Typography variant="h3" sx={{
                                fontWeight: 900,
                                color: 'text.primary',
                                lineHeight: 1.2,
                                mb: 1
                            }}>
                                {plantonista?.nome || "Chamado via GLPI"}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    {horaAtualStr} • {dataHojeFormatada}
                                </Typography>
                            </Stack>
                        </Box>

                        {plantonista && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: ativo ? alpha(corBorda, 0.2) : alpha(theme.palette.divider, 0.5),
                                    backgroundColor: ativo ? alpha(corBorda, 0.05) : alpha(theme.palette.action.hover, 0.3),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    filter: ativo ? 'none' : 'grayscale(0.7)',
                                    opacity: ativo ? 1 : 0.7,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: ativo ? corBorda : 'action.disabled',
                                            color: ativo ? 'white' : 'action.disabled',
                                            boxShadow: ativo ? 3 : 0,
                                            animation: ativo ? 'pulse 2s infinite' : 'none',
                                            '@keyframes pulse': {
                                                '0%': { transform: 'scale(1)' },
                                                '50%': { transform: 'scale(1.05)' },
                                                '100%': { transform: 'scale(1)' },
                                            }
                                        }}
                                    >
                                        <Phone />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            color: 'text.secondary'
                                        }}>
                                            Telefone
                                        </Typography>
                                        <Typography
                                        variant="h6"
                                        noWrap
                                        sx={{
                                            fontWeight: "bold",
                                            lineHeight: 1,
                                            whiteSpace: "nowrap",
                                        }}
                                        >
                                        {plantonista.telefone}
                                        </Typography>
                                    </Box>
                                </Stack>
                                {ativo && (
                                    <Button
                                        component="a"
                                        href={`tel:${plantonista.telefone}`}
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: theme.palette.success.dark,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            boxShadow: theme.shadows[2],
                                            px: 3,
                                            py: 1,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: theme.palette.success.main,
                                                boxShadow: theme.shadows[4],
                                            }
                                        }}
                                    >
                                        Acionamento somente por ligação
                                    </Button>
                                )}
                            </Paper>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </motion.div>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundImage: `url(${bgPlantao})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                p: { xs: 2, md: 4 },
            }}
        >
            {/* Overlay para escurecer o fundo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 6,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Paper
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            pr: 4,
                            borderRadius: 3,
                            backdropFilter: 'blur(10px)',
                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                            maxWidth: 'fit-content',
                        }}
                        elevation={0}
                    >
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: 'white',
                                width: 56,
                                height: 56,
                                boxShadow: theme.shadows[4],
                            }}
                        >
                            <img
                                src={LogoPizzatto}
                                alt="Logo Plantão TI - Pizzattolog"
                                style={{ width: '80%', height: '100%', objectFit: 'contain' }}
                            />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                                Plantão TI
                            </Typography>
                            <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8), fontWeight: 500 }}>
                                Pizzattolog
                            </Typography>
                        </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => { window.location.replace("/"); }}
                            sx={{
                                backdropFilter: 'blur(10px)',
                                backgroundColor: alpha(theme.palette.common.white, 0.2),
                                color: 'white',
                                borderColor: alpha(theme.palette.common.white, 0.3),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.3),
                                    borderColor: alpha(theme.palette.common.white, 0.4),
                                },
                                boxShadow: theme.shadows[4],
                                borderRadius: 2,
                                textTransform: 'none'
                            }}
                        >
                            Voltar para Login
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Person />}
                            onClick={() => { window.location.replace("/plantao/page-admin"); }}
                            sx={{
                                backdropFilter: 'blur(10px)',
                                backgroundColor: alpha(theme.palette.common.white, 0.2),
                                color: 'white',
                                borderColor: alpha(theme.palette.common.white, 0.3),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.3),
                                    borderColor: alpha(theme.palette.common.white, 0.4),
                                },
                                boxShadow: theme.shadows[4],
                                borderRadius: 2,
                            }}
                        >
                            Painel Admin
                        </Button>
                    </Box>
                </Box>

                {/* Main Content */}
                <Grid container spacing={3} sx={{ flex: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <PlantaoCard
                            titulo="Sistemas"
                            icon={Computer}
                            plantonista={plantonistaSis}
                            ativo={isPlantaoAtivoSis}
                            corBorda={theme.palette.warning.main}
                            corIcone={theme.palette.warning.main}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <PlantaoCard
                            titulo="Infraestrutura / Redes"
                            icon={Storage}
                            plantonista={plantonistaInfra}
                            ativo={isPlantaoAtivoInfra}
                            corBorda={theme.palette.info.main}
                            corIcone={theme.palette.info.main}
                        />
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 'auto', py: 4, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{
                        color: alpha(theme.palette.common.white, 0.6),
                        fontWeight: 500,
                        textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.3)}`,
                    }}>
                        Atualização automática em tempo real
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}