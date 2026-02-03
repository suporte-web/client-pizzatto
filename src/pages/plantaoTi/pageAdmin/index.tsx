import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Paper,
    Stack,
    IconButton,
    Alert,
    CircularProgress,
    Grid,
    alpha,
    useTheme,
} from "@mui/material";
import {
    ArrowBack,
    Save,
    Add,
    Delete,
    RestartAlt,
    CalendarMonth,
    AccessTime,
    Groups,
    Shield,
    Lock,
} from "@mui/icons-material";
import { usePlantaoData, type EscalaSemanal } from "../../../hooks/use-plantao-data";
import { useToast } from "../../../components/Toast";

/* =====================
    TIPOS
===================== */
type Area = "Sistemas" | "Infra";

type Contato = {
    id: string;
    nome: string;
    telefone: string;
    area: Area;
};

const DIAS_SEMANA = [
    { id: "segunda", label: "Segunda" },
    { id: "terca", label: "Terça" },
    { id: "quarta", label: "Quarta" },
    { id: "quinta", label: "Quinta" },
    { id: "sexta", label: "Sexta" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" },
];

export default function PlantaoPageAdmin() {
    const theme = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoginPending, setIsLoginPending] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");

    const {
        contatos,
        setContatos,
        escalaSistemas,
        setEscalaSistemas,
        escalaInfra,
        setEscalaInfra,
        janelaSistemas,
        setJanelaSistemas,
        janelaInfra,
        setJanelaInfra,
        salvarTudo,
        resetarPadrao,
    } = usePlantaoData();

    const { showToast } = useToast();

    /* =====================
        LÓGICA DE LOGIN
    ===================== */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoginPending(true);

        await new Promise((r) => setTimeout(r, 600));

        // Busca senha nos contatos
        const usuarioEncontrado = contatos.find((c) => {
            const apenasNumeros = c.telefone.replace(/\D/g, "");
            if (apenasNumeros.length < 4) return false;
            return apenasNumeros.slice(-4) === password;
        });

        // Senha mestra "0000" caso não existam contatos
        if (password === "0000" || usuarioEncontrado) {
            setIsAuthenticated(true);
            setLoggedUser(usuarioEncontrado ? usuarioEncontrado.nome : "Administrador");
            showToast("Acesso Permitido", 'success');
        } else {
            showToast("Senha incorreta", 'error');
        }
        setIsLoginPending(false);
    };

    /* =====================
        CRUD CONTATOS
    ===================== */
    const updateContato = <K extends keyof Contato>(index: number, field: K, value: Contato[K]) => {
        setContatos((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
    };

    const removeContato = (index: number) => {
        setContatos((prev) => prev.filter((_, i) => i !== index));
    };

    const addContato = () => {
        const id = typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now());
        setContatos((prev) => [...prev, { id, nome: "", telefone: "", area: "Sistemas" }]);
    };

    if (!isAuthenticated) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    p: 4,
                    position: 'relative',
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => { window.location.replace("/plantao/page-principal"); }}
                    sx={{
                        position: 'absolute',
                        top: 32,
                        left: 32,
                        color: 'text.secondary',
                        borderRadius: '10px'
                    }}
                >
                    Voltar
                </Button>

                <Paper
                    elevation={8}
                    sx={{
                        p: 6,
                        borderRadius: 4,
                        width: '100%',
                        maxWidth: 400,
                        textAlign: 'center',
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            mx: 'auto',
                            width: 80,
                            height: 80,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'primary.main',
                        }}
                    >
                        <Lock sx={{ fontSize: 40 }} />
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Acesso Administrativo
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Stack spacing={3} mt={4}>
                            <TextField
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="Senha (últimos 4 dígitos)"
                                inputProps={{
                                    maxLength: 4,
                                    style: {
                                        textAlign: 'center',
                                        letterSpacing: 8,
                                        fontSize: '1.5rem',
                                    }
                                }}
                                fullWidth
                            />

                            <Button
                                type="submit"
                                disabled={password.length < 4 || isLoginPending}
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                {isLoginPending ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </Stack>
                    </form>

                    <Typography variant="caption" sx={{ mt: 3, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                        Acesso administrativo pizzattolog.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'grey.50',
                p: 3,
                color: 'text.primary',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    mb={4}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            onClick={() => { window.location.replace("/"); }}
                            size="large"
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                backgroundColor: 'background.paper',
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Configuração
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Shield sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Logado como {loggedUser}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<RestartAlt />}
                            onClick={resetarPadrao}
                        >
                            Resetar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={salvarTudo}
                            sx={{
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            Salvar Tudo
                        </Button>
                    </Stack>
                </Stack>

                {/* SEÇÃO DE HORÁRIOS DO PLANTÃO */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        mb: 4,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ color: 'warning.main' }} />
                        Configuração de Horários
                    </Typography>

                    <Grid container spacing={3} mt={2}>
                        {/* Horários Sistemas */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                                    border: 1,
                                    borderColor: alpha(theme.palette.primary.light, 0.3),
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
                                    Horário Sistemas
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                            Início
                                        </Typography>
                                        <TextField
                                            type="time"
                                            value={janelaSistemas.inicio}
                                            onChange={(e) => setJanelaSistemas(prev => ({ ...prev, inicio: e.target.value }))}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                            Fim
                                        </Typography>
                                        <TextField
                                            type="time"
                                            value={janelaSistemas.fim}
                                            onChange={(e) => setJanelaSistemas(prev => ({ ...prev, fim: e.target.value }))}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Horários Infraestrutura */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.success.light, 0.05),
                                    border: 1,
                                    borderColor: alpha(theme.palette.success.light, 0.3),
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" color="success.main" gutterBottom>
                                    Horário Infraestrutura
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                            Início
                                        </Typography>
                                        <TextField
                                            type="time"
                                            value={janelaInfra.inicio}
                                            onChange={(e) => setJanelaInfra(prev => ({ ...prev, inicio: e.target.value }))}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                            Fim
                                        </Typography>
                                        <TextField
                                            type="time"
                                            value={janelaInfra.fim}
                                            onChange={(e) => setJanelaInfra(prev => ({ ...prev, fim: e.target.value }))}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 3, fontSize: '0.75rem' }}>
                        * Nota: Nos finais de semana (Sábado e Domingo), o sistema ignora estes horários e mantém o plantão ATIVO o dia todo.
                    </Alert>
                </Paper>

                {/* SEÇÃO: MEMBROS DA EQUIPE */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        mb: 4,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Groups sx={{ color: 'primary.main' }} />
                        Membros da Equipe
                    </Typography>

                    <Stack spacing={2} mt={3}>
                        {contatos.map((contato, index) => (
                            <Stack key={contato.id} direction="row" spacing={2} alignItems="center">
                                <TextField
                                    value={contato.nome}
                                    onChange={(e) => updateContato(index, "nome", e.target.value)}
                                    placeholder="Nome"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    value={contato.telefone}
                                    onChange={(e) => updateContato(index, "telefone", e.target.value)}
                                    placeholder="Telefone"
                                    size="small"
                                    sx={{ width: 160 }}
                                />
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Área</InputLabel>
                                    <Select
                                        value={contato.area}
                                        label="Área"
                                        onChange={(e) => updateContato(index, "area", e.target.value as Area)}
                                    >
                                        <MenuItem value="Sistemas">Sistemas</MenuItem>
                                        <MenuItem value="Infra">Infra</MenuItem>
                                    </Select>
                                </FormControl>
                                <IconButton
                                    onClick={() => removeContato(index)}
                                    sx={{ color: 'error.main' }}
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
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            py: 1.5,
                        }}
                    >
                        Adicionar Novo Membro
                    </Button>
                </Paper>

                {/* SEÇÃO: ESCALAS SEMANAIS */}
                <Grid container spacing={3}>
                    {/* ESCALA SISTEMAS */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                backgroundColor: 'background.paper',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'primary.main'
                            }}>
                                <CalendarMonth />
                                Escala Sistemas
                            </Typography>

                            <Stack spacing={3} mt={2}>
                                {DIAS_SEMANA.map((dia) => (
                                    <Stack key={dia.id} direction="row" alignItems="center" spacing={2}>
                                        <Typography sx={{ width: 80, fontWeight: 'medium' }}>
                                            {dia.label}
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Plantonista</InputLabel>
                                            <Select
                                                value={escalaSistemas[dia.id as keyof EscalaSemanal]}
                                                label="Plantonista"
                                                onChange={(e) => setEscalaSistemas((prev) => ({ ...prev, [dia.id]: e.target.value }))}
                                            >
                                                {contatos
                                                    .filter((c) => c.area === "Sistemas" && c.nome.trim() !== "")
                                                    .map((c) => (
                                                        <MenuItem key={c.id} value={c.nome}>
                                                            {c.nome}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* ESCALA INFRA */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                backgroundColor: 'background.paper',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'success.main'
                            }}>
                                <CalendarMonth />
                                Escala Infra
                            </Typography>

                            <Stack spacing={3} mt={2}>
                                {DIAS_SEMANA.map((dia) => (
                                    <Stack key={dia.id} direction="row" alignItems="center" spacing={2}>
                                        <Typography sx={{ width: 80, fontWeight: 'medium' }}>
                                            {dia.label}
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Plantonista</InputLabel>
                                            <Select
                                                value={escalaInfra[dia.id as keyof EscalaSemanal]}
                                                label="Plantonista"
                                                onChange={(e) => setEscalaInfra((prev) => ({ ...prev, [dia.id]: e.target.value }))}
                                            >
                                                {contatos
                                                    .filter((c) => c.area === "Infra" && c.nome.trim() !== "")
                                                    .map((c) => (
                                                        <MenuItem key={c.id} value={c.nome}>
                                                            {c.nome}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}