import axios from "@/lib/axios";

export type InitPaystackPayload = {
  email: string;
  amount: number;
  currency?: string;
  bookingReference?: string;
};

export type InitPaystackResponse = {
  authorizationUrl: string;
  reference: string;
};

export type VerifyPaystackResponse = {
  success: boolean;
  bookingReference?: string;
};

export const initPaystackPayment = async (
  payload: InitPaystackPayload,
): Promise<InitPaystackResponse> => {
  const { data } = await axios.post("/payments/paystack/init", payload);
  return data as InitPaystackResponse;
};

export const verifyPaystackPayment = async (
  reference: string,
): Promise<VerifyPaystackResponse> => {
  const { data } = await axios.post("/payments/paystack/verify", { reference });
  return data as VerifyPaystackResponse;
};


