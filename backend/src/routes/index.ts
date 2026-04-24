import express from "express";
import bookingRoutes from "./booking.routes";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import addonRoutes from "./addon.routes";
import packageRoutes from "./package.routes";
import gameRoutes from "./game.routes";
import testRoutes from "./test.routes";
import contactRoutes from "./contact.routes";

const router = express.Router();

router.use("/", bookingRoutes);
router.use("/admin/auth", authRoutes); // Must be before /admin so login is reachable
router.use("/admin", adminRoutes);
router.use("/", addonRoutes);
router.use("/", packageRoutes);
router.use("/", gameRoutes);
router.use("/", contactRoutes);
router.use("/test", testRoutes);

export default router;
