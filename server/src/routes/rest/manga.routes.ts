import express from "express";
import {
  uploadMangaController,
  updateMangaController,
} from "../../controllers/manga.controllers.js";
import { adminMiddleware } from "src/middleware/access.middleware.js";

const router = express.Router();

router.use(adminMiddleware);

router.post("/upload-chapter", uploadMangaController);
router.put("/update-manga", updateMangaController);

export default router;
