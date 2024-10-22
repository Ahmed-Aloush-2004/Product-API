import express from "express";
import { Router } from "express";
import { signup, login, getUserProfile, getMe } from "../controller/UserController.js";
import {authMid} from "../middleware/authMid.js"
const router = Router();

router.post("/signup", signup);
router.get("/me",authMid, getMe);
router.post("/login", login);
router.get("/userProfile",authMid, getUserProfile);

export default router;
