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
  contatoId: string;
}

const STORAGE_KEY = "plantao_ti_data";
const DEFAULT_ESCALA: EscalaSemanal = { segunda: "", terca: "", quarta: "", quinta: "", sexta: "", sabado: "", domingo: "" };
const DEFAULT_JANELA: JanelaEspecial = { inicio: "18:00", fim: "07:00", contatoId: "" };

export function usePlantaoData() {
  const { showToast } = useToast();
  
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [escalaSistemas, setEscalaSistemas] = useState<EscalaSemanal>(DEFAULT_ESCALA);
  const [escalaInfra, setEscalaInfra] = useState<EscalaSemanal>(DEFAULT_ESCALA);
  const [janelaSistemas, setJanelaSistemas] = useState<JanelaEspecial>(DEFAULT_JANELA);
  const [janelaInfra, setJanelaInfra] = useState<JanelaEspecial>(DEFAULT_JANELA);

  // 1. CARREGAR
  useEffect(() => {
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
  }, []);

  // 2. SALVAR (Com validação anti-erro)
  const salvarTudo = async () => {
    // PROTEÇÃO: Remove contatos sem nome para não quebrar o SelectItem
    const contatosValidos = contatos.filter(c => c.nome && c.nome.trim() !== "");

    if (contatosValidos.length !== contatos.length) {
      setContatos(contatosValidos); // Atualiza o estado removendo os vazios
    }

    const payload = {
      contatos: contatosValidos,
      escalaSistemas,
      escalaInfra,
      janelaSistemas,
      janelaInfra
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      showToast("Dados sincronizados localmente!", "success");
    } catch (error) {
      showToast("Limite de memória do navegador atingido.!", "error");
    }
  };

  const resetarPadrao = () => {
    if (confirm("Isso apagará todos os contatos e escalas. Confirmar?")) {
      setContatos([]);
      setEscalaSistemas(DEFAULT_ESCALA);
      setEscalaInfra(DEFAULT_ESCALA);
      localStorage.removeItem(STORAGE_KEY);
      showToast("Dados limpos com sucesso.", 'success');
    }
  };

  return {
    contatos, setContatos,
    escalaSistemas, setEscalaSistemas,
    escalaInfra, setEscalaInfra,
    janelaSistemas, setJanelaSistemas,
    janelaInfra, setJanelaInfra,
    salvarTudo, resetarPadrao
  };
}