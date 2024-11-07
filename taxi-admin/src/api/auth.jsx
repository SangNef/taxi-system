import { post } from "./index";

export const login = async (data) => {
  return await post("/login", data);
};
