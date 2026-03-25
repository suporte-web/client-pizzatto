import { Api } from "../../utils/api";

export const PlantaoService = {
  config: async () => {
    const get = await Api.get(`/plantao/config`);
    return get.data;
  },

  updateConfig: async (data: any) => {
    const put = await Api.put(`/plantao/update-config`, data);
    return put.data;
  },

  updateHorarios: async (data: any) => {
    const put = await Api.put(`/plantao/update-horarios`, data);
    return put.data;
  },

  updateMembrosEquipe: async (data: any) => {
    const put = await Api.put(`/plantao/update-membros-equipe`, data);
    return put.data;
  },
  
  updateEscalas: async (data: any) => {
    const put = await Api.put(`/plantao/update-escalas`, data);
    return put.data;
  },

  getAllPlantonistas: async () => {
    const get = await Api.get(`/plantao/find-all-plantonistas`);
    return get.data;
  },

  getAllEscalasAndHorarios: async () => {
    const get = await Api.get(`/plantao/find-all-escalas-and-horarios`);
    return get.data;
  },

  getPlantonistaDiaSemana: async () => {
    const get = await Api.get(`/plantao/find-plantonista-dia-semana`);
    return get.data;
  },
};
