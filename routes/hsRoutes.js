import express from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getEventTeams,
} from "../controllers/hs/eventController.js";
import { getEmployeeByEmail } from "../controllers/hs/employeeController.js";

const router = express.Router();

router.route("/events").get(getEvents).post(createEvent);
router.route("/events/teams").get(getEventTeams);
router.route("/events/:id").get(getEventById).put();
router.route("/employees").get().post();
router.route("/employees/:email").get(getEmployeeByEmail).put();

export default router;
