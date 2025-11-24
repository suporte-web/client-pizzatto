import { Api } from "../../utils/api";

export const ToDoService = {
  create: async (data: any) => {
    const create = await Api.post("/to-do/create", data);
    return create.data;
  },

  findByFilter: async (data: any) => {
    const filter = await Api.post(`/to-do/find-by-filter`, data);
    return filter.data;
  },

  update: async (data: any) => {
    const upd = await Api.patch(`/to-do/update/${data._id}`, data);
    return upd.data;
  },
};
