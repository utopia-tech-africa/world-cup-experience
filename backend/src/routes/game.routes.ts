import express from "express";
import { getGames } from "../controllers/game.controller";

const router = express.Router();

router.get("/games", getGames);

export default router;
