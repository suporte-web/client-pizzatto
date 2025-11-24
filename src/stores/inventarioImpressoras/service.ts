import { Api } from "../../utils/api";

export const InventarioImpressorasService = {
  create: async (data: any) => {
    const create = await Api.post("/inventarioImpressoras/create", data);
    return create.data;
  },

  createBySpreadsheet: async (data: any) => {
    const create = await Api.post("/inventarioImpressoras/create-by-spreadsheet", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const filter = await Api.post(`/inventarioImpressoras/find-by-filter`, data);
    return filter.data;
  },

  update: async (data: any) => {
    const update = await Api.patch(`/inventarioImpressoras/update`, data);
    return update.data;
  },
};
