import express from "express";
import { uploadMangaController } from "../../controllers/manga.controllers.js";

const router = express.Router();
// TODO add admin middleware

router.post("/upload-chapter", uploadMangaController);

export default router;