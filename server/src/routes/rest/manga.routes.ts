import express from "express";
import {
  uploadMangaController,
  updateMangaController,
} from "../../controllers/manga.controllers.js";

const router = express.Router();
// TODO add admin middleware

router.post("/upload-chapter", uploadMangaController);

router.put("/update-manga", updateMangaController);

export default router;
