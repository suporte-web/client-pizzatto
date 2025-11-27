import { Api } from "../../utils/api";
import type { IUser } from "./types";

export const UserService = {
  create: async (data: any): Promise<IUser> => {
    const create = await Api.post("/user/create", data);
    return create.data;
  },

  findAll: async () => {
    const post = await Api.get("/user/find-all");
    return post.data;
  },

  findByFilter: async (data: any) => {
    const post = await Api.post("/user/find-by-filter", data);
    return post.data;
  },

  update: async (id: string, data: any) => {
    const put = await Api.put(`/user/update/${id}`, data);
    return put.data;
  },

  findOne: async (id: string) => {
    const get = await Api.get(`/user/find-one/${id}`);
    return get.data;
  },

  updateSenha: async (data: any) => {
    const patch = await Api.patch(`/user/update-senha`, data);
    return patch.data;
  },

  getUsersAtivos: async () => {
    const get = await Api.get(`/user/get-users-ativos`);
    return get.data;
  },
};
