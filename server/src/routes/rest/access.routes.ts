import express from "express"
import { createS3UploadURL } from "@controllers/uploadS3URL.controller.js"

const router =  express.Router();
// TODO add admin only middleware

router.post("/sign-url", createS3UploadURL);

export default router;