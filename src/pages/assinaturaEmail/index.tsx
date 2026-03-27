import { Box, Container, Tab, Tabs } from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useCallback, useEffect, useState } from "react";
import { AssinaturaEmailService } from "../../stores/assinaturaEmail/service";
import TabAprovacaoAssinaturas from "./components/TabAprovacaoAssinaturas";
import TabAssinaturaPadrao from "./components/TabAssinaturaPadrao";
import { AssinaturaPadraoService } from "../../stores/assinaturaPadrao/services";

const AssinaturaEmail = () => {
  const [loading, setLoading] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flushHook, setFlushHook] = useState(false);
  const [tab, setTab] = useState(0);

  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [assinaturasPadrao, setAssinaturasPadrao] = useState<any[]>([]);
  const [assinaturaPadrao, setAssinaturaPadrao] = useState({});

  const fetchDataAssinaturasToAprovar = async () => {
    setLoading(true);
    try {
      const get = await AssinaturaEmailService.findByFilter({
        pesquisa,
        page,
        limit: rowsPerPage,
      });

      setAssinaturas(get.result ?? []);
      setTotalPages(get.total ?? 0);
    } catch (error) {
      console.log(error);
      setAssinaturas([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAssinaturasToAprovar();
  }, [pesquisa, page, rowsPerPage, flushHook]);

  useEffect(() => {
    fetchDataAssinaturasToAprovar();
  }, [flushHook]);

  const fetchDataAssinaturasPadrao = useCallback(async () => {
    setLoading(true);
    try {
      const getAtual = await AssinaturaPadraoService.findAtual();

      setAssinaturaPadrao(getAtual);

      const getPadroes = await AssinaturaPadraoService.findByFilter({
        page: page,
        limit: rowsPerPage,
      });
      setAssinaturasPadrao(getPadroes.result ?? []);
      setTotalPages(getPadroes.total ?? 0);
    } catch (error) {
      console.log(error);
      setAssinaturas([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchDataAssinaturasPadrao();
  }, [fetchDataAssinaturasPadrao, flushHook]);

  return (
    <SidebarNew>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => {
              setTab(newValue);
            }}
          >
            <Tab label="Ajustar Assinatura" />
            <Tab label={`Aprovar/Reprovar Assinaturas (${totalPages || 0})`} />
          </Tabs>
        </Box>

        {tab === 0 && (
          <TabAssinaturaPadrao
            assinaturas={assinaturasPadrao}
            totalPages={totalPages}
            setFlushHook={setFlushHook}
            // pesquisa={pesquisa}
            // setPesquisa={setPesquisa}
            loading={loading}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            // assinaturaPadrao={assinaturaPadrao}
          />
        )}

        {tab === 1 && (
          <TabAprovacaoAssinaturas
            assinaturas={assinaturas}
            totalPages={totalPages}
            setFlushHook={setFlushHook}
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            loading={loading}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            assinaturaPadrao={assinaturaPadrao}
          />
        )}
      </Container>
    </SidebarNew>
  );
};

export default AssinaturaEmail;
