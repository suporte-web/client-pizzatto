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
    const filter = await usersAdApi.post(`/ad-users/get-users-ad-by-filter`, data);
    return filter.data;
  },
};
