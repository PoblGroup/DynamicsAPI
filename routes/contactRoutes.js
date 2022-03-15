import express from "express";
import {
  getContactById,
  getContacts,
} from "../controllers/contactControllers.js";
const router = express.Router();

router.route("/").get(getContacts).post();
router.route("/:id").get(getContactById).put();

export default router;
