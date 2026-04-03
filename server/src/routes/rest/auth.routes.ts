import {
  loginController,
  logoutController,
  refreshAccessTokenController,
  signUpController,
} from "@controllers/auth.controllers.js";
import express from "express";

const router = express.Router();

router.post("/sign-up", signUpController);
router.post("/login", loginController);
router.post("/refresh", refreshAccessTokenController);
router.post("/logout", logoutController);

export default router;
