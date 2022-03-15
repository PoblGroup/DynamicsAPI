import express from "express";
import { getOccupancies, getOccupancyById } from "../controllers/occupancyController.js";
const router = express.Router();

router.route("/").get(getOccupancies).post();
router.route("/:id").get(getOccupancyById).put();

export default router;