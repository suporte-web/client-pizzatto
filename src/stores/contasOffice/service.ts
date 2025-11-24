import { Api } from "../../utils/api";

export const ContaOfficeService = {
  create: async (data: any) => {
    const create = await Api.post("/contas-office/create", data);
    return create.data;
  },

  createBySpreadsheet: async (data: any) => {
    const create = await Api.post("/contas-office/create-by-spreadsheet", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const filter = await Api.post(`/contas-office/find-by-filter`, data);
    return filter.data;
  },

  update: async (data: any) => {
    const update = await Api.patch(`/contas-office/update/${data._id}`, data);
    return update.data;
  },
};
