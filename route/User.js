import express from "express";
import { Router } from "express";
import { signup, login, getUserProfile } from "../controller/UserController.js";
import {authMid} from "../middleware/authMid.js"
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/userProfile",authMid, getUserProfile);

export default router;
