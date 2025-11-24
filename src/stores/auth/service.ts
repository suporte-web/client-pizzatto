import { Api } from "../../utils/api";

export const loginUser = async ({ email, senha }: any) => {
  const response = await Api.post("/auth/login", {
    email,
    senha,
  });
  return response.data;
};

export const verifyToken = async (token: string, email: string) => {
  const response = await Api.post("/auth/verify", {
    code: token,
    email,
  });
  return response.data;
};

export const auth = async () => {
  const response = await Api.get("/auth/me", {});
  return response.data;
};
