import { Api } from "../../utils/api";

export const InventarioService = {
  create: async (data: any) => {
    const create = await Api.post("/inventario/create", data);
    return create.data;
  },

  createBySpreadsheet: async (data: any) => {
    const create = await Api.post("/inventario/create-by-spreadsheet", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const filter = await Api.post(`/inventario/find-by-filter`, data);
    return filter.data;
  },

  update: async (data: any) => {
    const update = await Api.patch(`/inventario/update`, data);
    return update.data;
  },
};
