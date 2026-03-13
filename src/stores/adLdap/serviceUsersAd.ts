import { createApi } from "../../utils/api";
const usersAdApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const UserAdService = {
  create: async (data: any) => {
    const create = await usersAdApi.post("/ad-users/create-user-ad", data);
    return create.data;
  },

  getAllUsersAd: async () => {
    const get = await usersAdApi.get("/ad-users/get-all-users-ad");
    return get.data;
  },

  getUsersAdByFilter: async (data: any) => {
    const filter = await usersAdApi.post(
      `/ad-users/get-users-ad-by-filter`,
      data
    );
    return filter.data;
  },

  getGroupsUsersAd: async () => {
    const get = await usersAdApi.get(`/ad-users/groups`);
    return get.data;
  },

  update: async (data: any) => {
    const upd = await usersAdApi.post(`/ad-users/update`, data);
    return upd.data;
  },

  resetPasswordAndForceChange: async (data: any) => {
    const reset = await usersAdApi.post(
      `/ad-users/reset-password`,
      data
    );
    return reset.data;
  },
};
