import express from "express";
import { getAccountById, getAccounts } from "../controllers/accountController.js";
const router = express.Router();

router.route("/").get(getAccounts).post();
router.route("/:id").get(getAccountById).put();

export default router;