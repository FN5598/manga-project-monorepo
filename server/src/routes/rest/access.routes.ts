import express from "express";
import { createS3UploadURL } from "@controllers/uploadS3URL.controller.js";
import { adminMiddleware } from "@middlewares/access.middleware.js";

const router = express.Router();

router.use(adminMiddleware);

router.post("/sign-url", createS3UploadURL);

export default router;
