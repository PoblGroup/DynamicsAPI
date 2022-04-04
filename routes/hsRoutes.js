import express from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getEventTeams,
  getLookups,
} from "../controllers/hs/eventController.js";
import { getEmployeeByEmail } from "../controllers/hs/employeeController.js";
import {
  confirmPolicyResponse,
  getpolicyDocumentFiles,
  getPolicyResponseById,
  getPolicyResponses,
} from "../controllers/hs/policyController.js";

const router = express.Router();

// EVENTS
router.route("/events").get(getEvents).post(createEvent);
router.route("/events/teams").get(getEventTeams);
router.route("/events/lookups").get(getLookups);
router.route("/events/:id").get(getEventById).put();

// EMPLOYEES
router.route("/employees").get().post();
router.route("/employees/:email").get(getEmployeeByEmail).put();

// POLICY RESPONSES
router.route("/policyresponses").get(getPolicyResponses).post();
router
  .route("/policyresponses/:id")
  .get(getPolicyResponseById)
  .patch(confirmPolicyResponse);
router.route("/policydocument/files").get(getpolicyDocumentFiles);

export default router;
