import { get, post } from "./index";

export const searchLocation = async (data) => {
  return get(`/search-location?wardName=${data}`);
};

export const createBooking = async (data) => {
  return post("/store", data);
};

export const searchBooking = async (data) => {
  return get(`/search-booking?code=${data}`);
};
