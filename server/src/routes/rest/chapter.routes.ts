import { addChapterToMangaController } from "@controllers/chapters.controllers.js";
import express from "express";
import { adminMiddleware } from "src/middleware/access.middleware.js";

const router = express.Router();

router.use(adminMiddleware);
router.post("/create-chapter", addChapterToMangaController);

export default router;
