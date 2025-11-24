import { Api } from "../../utils/api";

export const PopsService = {
  create: async (data: any) => {
    const create = await Api.post("/pop/create", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const filter = await Api.post("/pop/find-by-filter", data);
    return filter.data;
  },
};
