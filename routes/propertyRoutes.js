import express from "express";
import { getProperties, getPropertyById } from "../controllers/propertyController.js";
const router = express.Router();

router.route("/").get(getProperties).post();
router.route("/:id").get(getPropertyById).put();

export default router;