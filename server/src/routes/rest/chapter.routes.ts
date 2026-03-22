import { addChapterToMangaController } from "@controllers/chapters.controllers.js";
import express from "express";

const router = express.Router();

router.post("/create-chapter", addChapterToMangaController);

export default router;
