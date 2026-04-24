import express from "express";
import {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
} from "../controllers/contact.controller";

const router = express.Router();

router.post("/contact", createContactMessage);
router.get("/admin/contact", getContactMessages);
router.patch("/admin/contact/:id/status", updateContactStatus);

export default router;
