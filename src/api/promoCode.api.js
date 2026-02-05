import { http } from "./http";

const API = "https://api.kancheepuramsmsilks.net/api";
// const API = "http://localhost:5000/api";

export const createPromoCode = (promoCode) =>
  http(`${API}/promoCode`, {
    method: "POST",
    body: JSON.stringify({ promoCode }),
  });

export const addEmailToPromoCode = (payload) =>
  http(`${API}/promoCode/email`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteEmailFromPromoCode = (payload) =>
  http(`${API}/promoCode/email`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });

export const updateDiscount = (payload) =>
  http(`${API}/promoCode/email`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getPromoCodes = (offset, limit) =>
  http(`${API}/promoCodes?offset=${offset}&limit=${limit}`);

export const searchPromoCodes = (value) =>
  http(`${API}/promoCode/search/${value}`);

export const deletePromoCode = (payload) =>
  http(`${API}/promoCode`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
