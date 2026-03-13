import { createApi } from "../../utils/api";
const usersAdApi = createApi(import.meta.env.VITE_API_BACKEND_AD);

export const loginUser = async ({ username, password }: any) => {
  const response = await usersAdApi.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const verifyToken = async (token: string, email: string) => {
  const response = await usersAdApi.post("/auth/verify", {
    code: token,
    email,
  });
  return response.data;
};

export const auth = async () => {
  const response = await usersAdApi.get("/auth/me", {});
  return response.data;
};
