import axios from "@/lib/axios";

export interface ContactMessageData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  packageName?: string;
}

export interface ContactMessage extends ContactMessageData {
  id: string;
  status: "pending" | "read" | "archived";
  createdAt: string;
}

export const createContactMessage = async (data: ContactMessageData) => {
  const { data: response } = await axios.post("/contact", data);
  return response;
};

export const getContactMessages = async () => {
  const { data } = await axios.get("/admin/contact");
  return data.messages as ContactMessage[];
};

export const updateContactStatus = async (id: string, status: string) => {
  const { data } = await axios.patch(`/admin/contact/${id}/status`, { status });
  return data;
};
