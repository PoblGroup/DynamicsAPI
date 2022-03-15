import express from "express";
import { getDyanmicsToken } from "../controllers/authController.js";

const router = express.Router();

router.route("/dynamics").get(getDyanmicsToken).post();
router.route("/:id").get().put();

export default router;
