// use-plantao-data.ts
import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";

export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  area: "Sistemas" | "Infra";
}

export interface EscalaSemanal {
  segunda: string;
  terca: string;
  quarta: string;
  quinta: string;
  sexta: string;
  sabado: string;
  domingo: string;
}

export interface JanelaEspecial {
  inicio: string;
  fim: string;
  // contatoId existe no front, mas NÃO é usado no backend
  contatoId: string;
}

type ApiConfig = {
  configId: string;
  janelaSistemas: { inicio: string; fim: string };
  janelaInfra: { inicio: string; fim: string };
  escalaSistemas: EscalaSemanal;
  escalaInfra: EscalaSemanal;
  contatos: Contato[];
};

const STORAGE_KEY = "plantao_ti_data";

const DEFAULT_ESCALA: EscalaSemanal = {
  segunda: "",
  terca: "",
  quarta: "",
  quinta: "",
  sexta: "",
  sabado: "",
  domingo: "",
};

const DEFAULT_JANELA: JanelaEspecial = { inicio: "18:00", fim: "07:00", contatoId: "" };

const API_BASE =
  (import.meta as any).env?.VITE_API_BACKEND?.replace(/\/$/, "") || "http://localhost:2999";

// remove da escala qualquer nome que não exista em contatos
function limparEscalaPorNomesValidos(
  escala: EscalaSemanal,
  nomesValidos: Set<string>
): EscalaSemanal {
  const validar = (v: string) => (v && nomesValidos.has(v) ? v : "");
  return {
    segunda: validar(escala.segunda),
    terca: validar(escala.terca),
    quarta: validar(escala.quarta),
    quinta: validar(escala.quinta),
    sexta: validar(escala.sexta),
    sabado: validar(escala.sabado),
    domingo: validar(escala.domingo),
  };
}

export function usePlantaoData() {
  const { showToast } = useToast();

  const [contatos, setContatos] = useState<Contato[]>([]);
  const [escalaSistemas, setEscalaSistemas] = useState<EscalaSemanal>(DEFAULT_ESCALA);
  const [escalaInfra, setEscalaInfra] = useState<EscalaSemanal>(DEFAULT_ESCALA);
  const [janelaSistemas, setJanelaSistemas] = useState<JanelaEspecial>(DEFAULT_JANELA);
  const [janelaInfra, setJanelaInfra] = useState<JanelaEspecial>(DEFAULT_JANELA);
  const [configId, setConfigId] = useState<string>("");

  const carregarDaApi = async () => {

    
    const res = await fetch(`${API_BASE}/plantao/config`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error(`GET /plantao/config falhou: ${res.status}`);

    const data = (await res.json()) as ApiConfig;

    setConfigId(data.configId ?? "");
    setContatos(data.contatos ?? []);

    setEscalaSistemas(data.escalaSistemas ?? DEFAULT_ESCALA);
    setEscalaInfra(data.escalaInfra ?? DEFAULT_ESCALA);

    // backend não tem contatoId -> mantém contatoId vazio
    setJanelaSistemas({
      inicio: data.janelaSistemas?.inicio ?? DEFAULT_JANELA.inicio,
      fim: data.janelaSistemas?.fim ?? DEFAULT_JANELA.fim,
      contatoId: "",
    });

    setJanelaInfra({
      inicio: data.janelaInfra?.inicio ?? DEFAULT_JANELA.inicio,
      fim: data.janelaInfra?.fim ?? DEFAULT_JANELA.fim,
      contatoId: "",
    });

    // salva uma cópia local como fallback
    const localPayload = {
      contatos: data.contatos ?? [],
      escalaSistemas: data.escalaSistemas ?? DEFAULT_ESCALA,
      escalaInfra: data.escalaInfra ?? DEFAULT_ESCALA,
      janelaSistemas: {
        inicio: data.janelaSistemas?.inicio ?? DEFAULT_JANELA.inicio,
        fim: data.janelaSistemas?.fim ?? DEFAULT_JANELA.fim,
        contatoId: "",
      },
      janelaInfra: {
        inicio: data.janelaInfra?.inicio ?? DEFAULT_JANELA.inicio,
        fim: data.janelaInfra?.fim ?? DEFAULT_JANELA.fim,
        contatoId: "",
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(localPayload));
  };

  // 1) CARREGAR: tenta API primeiro, se falhar usa localStorage
  useEffect(() => {
    (async () => {
      try {
        await carregarDaApi();
      } catch (err) {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            if (data.contatos) setContatos(data.contatos);
            if (data.escalaSistemas) setEscalaSistemas(data.escalaSistemas);
            if (data.escalaInfra) setEscalaInfra(data.escalaInfra);
            if (data.janelaSistemas) setJanelaSistemas(data.janelaSistemas);
            if (data.janelaInfra) setJanelaInfra(data.janelaInfra);
          } catch (e) {
            console.error("Erro ao carregar LocalStorage", e);
          }
        }
      }
    })();
  }, []);

  // 2) SALVAR
  const salvarTudo = async () => {
    const contatosValidos = contatos
      .filter((c) => c.nome && c.nome.trim() !== "")
      .map((c) => ({ ...c, nome: c.nome.trim() }));

    if (contatosValidos.length !== contatos.length) setContatos(contatosValidos);

    // nomes permitidos para a escala (evita "out-of-range" e dados inválidos)
    const nomesValidos = new Set(contatosValidos.map((c) => c.nome));

    const escalaSistemasLimpa = limparEscalaPorNomesValidos(escalaSistemas, nomesValidos);
    const escalaInfraLimpa = limparEscalaPorNomesValidos(escalaInfra, nomesValidos);

    // opcional: já atualiza o estado pra UI parar de reclamar do MUI
    setEscalaSistemas(escalaSistemasLimpa);
    setEscalaInfra(escalaInfraLimpa);

    const payloadApi = {
      ...(configId ? { configId } : {}), // não manda vazio
      contatos: contatosValidos,
      escalaSistemas: escalaSistemasLimpa,
      escalaInfra: escalaInfraLimpa,
      janelaSistemas: { inicio: janelaSistemas.inicio, fim: janelaSistemas.fim },
      janelaInfra: { inicio: janelaInfra.inicio, fim: janelaInfra.fim },
    };

    try {

      console.log("API_BASE:", API_BASE);
      console.log("URL:", `${API_BASE}/plantao/config`);
      console.log("payloadApi:", payloadApi);

      const res = await fetch(`${API_BASE}/plantao/update-config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payloadApi),
     });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.error("Erro PUT /plantao/update-config:", res.status, errBody);
        throw new Error(`PUT /plantao/update-config falhou: ${res.status}`);
      }

      await carregarDaApi();
      showToast("Dados salvos no servidor!", "success");
    } catch (error) {
      const payloadLocal = {
        contatos: contatosValidos,
        escalaSistemas: escalaSistemasLimpa,
        escalaInfra: escalaInfraLimpa,
        janelaSistemas,
        janelaInfra,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadLocal));
        showToast("API indisponível. Salvo localmente.", "warning");
      } catch {
        showToast("Limite de memória do navegador atingido.!", "error");
      }
    }
  };

  const resetarPadrao = () => {
    if (confirm("Isso apagará todos os contatos e escalas. Confirmar?")) {
      setContatos([]);
      setEscalaSistemas(DEFAULT_ESCALA);
      setEscalaInfra(DEFAULT_ESCALA);
      setJanelaSistemas(DEFAULT_JANELA);
      setJanelaInfra(DEFAULT_JANELA);

      localStorage.removeItem(STORAGE_KEY);
      showToast("Dados limpos com sucesso.", "success");
    }
  };

  return {
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
    configId,
  };
}