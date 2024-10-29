import { get } from "./index";

export const getDrivers = async () => {
  return await get("/driver/index");
};
