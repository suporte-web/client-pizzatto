import {
    PersonAdd,
    Close,
    Save
} from "@mui/icons-material"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Button,
    Box,
    Avatar,
    Typography,
    Divider
} from "@mui/material"
import { useState } from "react"
import { useToast } from "../../../components/Toast"
import { UserService } from "../../../stores/users/service"
import moment from "moment"

const ModalCriarUser = ({ setFlushHook }: any) => {
    const { showToast } = useToast()
    const [open, setOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreateUser = async () => {
        if (!nome || !email) {
            showToast('Preencha todos os campos obrigatórios', 'warning')
            return
        }

        setLoading(true)
        try {
            await UserService.create({ nome, email, dataAdmissao: moment().format('YYYY-MM-DD') })
            setFlushHook((prev: any) => !prev)
            showToast('Usuário criado com sucesso!', 'success')
            setOpen(false)
            setNome('')
            setEmail('')
        } catch (error) {
            console.error(error)
            showToast('Erro ao criar usuário', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setOpen(false)
        setNome('')
        setEmail('')
    }

    return (
        <>
            <Tooltip title="Criar Novo Usuário" arrow>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 14px rgba(25, 118, 210, 0.4)',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    Novo Usuário
                </Button>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
                        <PersonAdd fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" component="span" fontWeight="600">
                        Criar Novo Usuário
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: 'white',
                            ml: 'auto',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
                        <TextField
                            label="Nome Completo"
                            variant="outlined"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    fontWeight: 500
                                }
                            }}
                        />

                        <TextField
                            label="E-mail"
                            variant="outlined"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    fontWeight: 500
                                }
                            }}
                        />

                        <Box sx={{
                            backgroundColor: 'grey.50',
                            borderRadius: '12px',
                            p: 2,
                            mt: 1
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Data de admissão:</strong> {moment().format('DD/MM/YYYY')}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleClose}
                        startIcon={<Close />}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 2.5,
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'grey.100'
                            }
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleCreateUser}
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading || !nome || !email}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            boxShadow: '0 4px 10px rgba(25, 118, 210, 0.25)',
                            '&:hover': {
                                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.35)',
                            },
                            '&:disabled': {
                                backgroundColor: 'grey.300',
                                color: 'grey.500'
                            }
                        }}
                    >
                        {loading ? 'Criando...' : 'Criar Usuário'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ModalCriarUser