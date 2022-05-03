import express from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getEventTeams,
  getLookups,
  getTeamEvents,
  updateEvent,
} from "../controllers/hs/eventController.js";
import { getEmployeeByEmail } from "../controllers/hs/employeeController.js";
import {
  confirmPolicyResponse,
  getpolicyDocumentFiles,
  getPolicyResponseById,
  getPolicyResponses,
} from "../controllers/hs/policyController.js";
import {
  getDiaryEntries,
  getDiaryEntryById,
  updateEntry,
} from "../controllers/hs/diaryController.js";

const router = express.Router();

// EVENTS
router.route("/events").get(getEvents).post(createEvent);
router.route("/events/myteam").get(getTeamEvents);
router.route("/events/teams").get(getEventTeams);
router.route("/events/lookups").get(getLookups);
router.route("/events/:id").get(getEventById).patch(updateEvent);

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

// DIARY (TASKS / ENTRIES)
router.route("/diary/tasks").get();
router.route("/diary/entries").get(getDiaryEntries);
router.route("/diary/entries/:id").get(getDiaryEntryById).patch(updateEntry);

export default router;
