import express from "express";
import {
  comparePackageOptions,
  getPackageComparison,
  getPackages,
} from "../controllers/package.controller";

const router = express.Router();

router.get("/packages", getPackages);
router.get("/packages/comparison", comparePackageOptions);
router.get("/packages/:id/comparison", getPackageComparison);

export default router;
