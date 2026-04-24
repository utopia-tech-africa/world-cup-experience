import { Request, Response } from "express";
import { prisma } from "../config/database.config";
import { z } from "zod";

const contactSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    message: z.string().optional().or(z.literal("")),
    packageName: z.string().optional().or(z.literal("")),
  })

  .refine((data) => data.email || data.phone, {
    message: "At least one of email or phone is required",
    path: ["email"],
  });

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        message: validatedData.message || "",
        packageName: validatedData.packageName || null,
      },
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: contactMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0].message });
      return;
    }

    const message =
      error instanceof Error ? error.message : "Failed to send message";
    res.status(500).json({ error: message });
  }
};

export const getContactMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ messages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch messages";
    res.status(500).json({ error: message });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    if (!["pending", "read", "archived"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    res.json({ message: "Status updated successfully", data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    res.status(500).json({ error: message });
  }
};
