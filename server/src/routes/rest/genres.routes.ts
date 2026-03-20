import express from "express";
import { getAllGenresController } from "@controllers/genres.controllers.js";

const router = express.Router();

router.get("/", getAllGenresController);

export default router;
