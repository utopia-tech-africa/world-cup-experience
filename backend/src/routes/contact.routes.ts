import express from "express";
import {
  createContactMessage,
  getContactMessages,
} from "../controllers/contact.controller";

const router = express.Router();

router.post("/contact", createContactMessage);
router.get("/admin/contact", getContactMessages); // This would normally have admin middleware

export default router;
