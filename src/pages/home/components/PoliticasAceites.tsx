import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { PoliticasService } from "../../../stores/politicas/service";
import { useToast } from "../../../components/Toast";
import { PoliticasAceitesService } from "../../../stores/politicasAceites/service";

const PoliticasAceites = () => {
  const { showToast } = useToast();

  const [politicas, setPoliticas] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAceite, setLoadingAceite] = useState(false);
  const [indexAtual, setIndexAtual] = useState(0);

  const politicaAtual = useMemo(() => {
    return politicas?.[indexAtual] ?? null;
  }, [politicas, indexAtual]);

  const arquivoUrl = politicaAtual?.caminhoArquivo
    ? `${import.meta.env.VITE_API_BACKEND}/${politicaAtual.caminhoArquivo}`.replace(
        /([^:]\/)\/+/g,
        "$1",
      )
    : "";

  const fetchData = async () => {
    try {
      setLoading(true);

      const get = await PoliticasService.findAllAceitesByUser();

      setPoliticas(get || []);

      if (get?.length > 0) {
        setIndexAtual(0);
        setAceite(false);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao buscar políticas liberadas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setAceite(false);
  };

  const handleAceitarPolitica = async () => {
    if (!politicaAtual) return;

    try {
      setLoadingAceite(true);

      await PoliticasAceitesService.create({
        politicaId: politicaAtual.id,
      });

      showToast("Política aceita com sucesso", "success");

      const proximoIndex = indexAtual + 1;

      if (proximoIndex < politicas.length) {
        setIndexAtual(proximoIndex);
        setAceite(false);
      } else {
        setOpen(false);
        setAceite(false);
      }
    } catch (error) {
      console.log(error);
      showToast("Erro ao aceitar política", "error");
    } finally {
      setLoadingAceite(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#0f172a",
          }}
        >
          Leitura e aceite da política
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {politicaAtual && (
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Documento para leitura
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    bgcolor: "#fff",
                  }}
                >
                  {arquivoUrl ? (
                    <iframe
                      src={arquivoUrl}
                      title={`Leitura da política ${politicaAtual.nome}`}
                      width="100%"
                      height="420px"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Não foi encontrado um arquivo para leitura dessa
                        política.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aceite}
                      onChange={(e) => setAceite(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#334155" }}>
                      Declaro que li e aceito a política{" "}
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {politicaAtual.nome}
                      </Box>
                      .
                    </Typography>
                  }
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
            }}
            disabled={loadingAceite}
          >
            Fechar
          </Button>

          <Button
            variant="contained"
            onClick={handleAceitarPolitica}
            disabled={!aceite || loadingAceite || !politicaAtual}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 1,
              boxShadow: "none",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              "&:hover": {
                boxShadow: "0 8px 18px rgba(22, 163, 74, 0.22)",
              },
            }}
          >
            {loadingAceite ? "Aceitando..." : "Aceitar Política"}
          </Button>
        </DialogActions>
      </Dialog>

      {!loading && politicas.length === 0 && <></>}
    </>
  );
};

export default PoliticasAceites;
