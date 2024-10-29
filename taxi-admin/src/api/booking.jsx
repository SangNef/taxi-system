import { get, post } from "./index";

export const getBookings = async () => {
  return await get("/booking/list");
};

export const createBooking = async (data) => {
  return await post("/booking/create", data);
};