"use strict";

import {
  GetEventById,
  GetEvents,
  CreateEvent,
} from "../../utils/Dynamics/Events.js";
import { GetTeams } from "../../utils/Dynamics/Teams.js";

const getEvents = async (req, res) => {
  const employeeId = req.query.employeeId;

  const token = req.headers["authorization"].split(" ")[1];

  if (employeeId) {
    try {
      const events = await GetEvents(token, employeeId);

      if (events.value.length == 0) {
        res.status(200).json({
          message: `No events found`,
        });
      }

      events.value.map((event) => {
        // console.log(event.pobl_casename);
        switch (event.pobl_casetype) {
          case 771570000:
            event.pobl_casetype = "Accident";
            break;
          case 771570001:
            event.pobl_casetype = "Incident";
            break;
          case 771570002:
            event.pobl_casetype = "Near Miss";
            break;
          default:
            break;
        }
      });

      res.status(200).json(events);
    } catch (error) {
      res.status(400).send(error);
    }
  }
};

const getEventById = async (req, res) => {
  const id = req.params.id;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const event = await GetEventById(token, id);

    if (event == null) {
      res.status(401).send("Event not found");
    }

    switch (event.pobl_casetype) {
      case 771570000:
        event.pobl_casetype = "Accident";
        break;
      case 771570001:
        event.pobl_casetype = "Incident";
        break;
      case 771570002:
        event.pobl_casetype = "Near Miss";
        break;
      default:
        break;
    }

    (event.pobl_description =
      event.pobl_description == null
        ? "No description provided.."
        : event.pobl_description),
      res.status(200).json(event);
  } catch (error) {
    res.status(500).send();
  }
};

const getEventTeams = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const teams = await GetTeams(token);

    if (teams.value.length == 0) {
      res.status(200).json({
        message: `No teams found`,
      });
    }

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).send();
  }
};

const createEvent = async (req, res) => {
  const eventData = req.body;
  const token = req.headers["authorization"].split(" ")[1];

  switch (eventData.caseType) {
    case "Accident":
      eventData.caseType = "771570000";
      break;
    case "Incident":
      eventData.caseType = "771570001";
      break;
    case "Near Miss":
      eventData.caseType = "771570002";
      break;
    default:
      break;
  }

  try {
    const createdEvent = await CreateEvent(token, eventData);
    res.status(200).json(createdEvent);
  } catch (error) {
    res.status(400).send(error);
  }
};

export { getEvents, getEventById, getEventTeams, createEvent };
