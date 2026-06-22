import { getCurrentUserController } from "@controllers/user.controllers.js";
import express from "express";

const router = express.Router();

router.get("/me", getCurrentUserController);

export default router;
