import axios from "@/lib/axios";

export interface ContactMessageData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  packageName?: string;
}

export const createContactMessage = async (data: ContactMessageData) => {
  const { data: response } = await axios.post("/contact", data);
  return response;
};
