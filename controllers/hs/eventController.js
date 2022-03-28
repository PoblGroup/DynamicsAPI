"use strict";

import { GetEmployees } from "../../utils/Dynamics/Employee.js";
import {
  GetEventById,
  GetEvents,
  CreateEvent,
  GetAccidentCategories,
  GetAccidentInjuries,
  GetAccidentInjuryParts,
} from "../../utils/Dynamics/Events.js";
import { GetTeam, GetTeams } from "../../utils/Dynamics/Teams.js";

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
    const dynamicsEvent = await GetEventById(token, id);

    if (dynamicsEvent == null) {
      res.status(401).send("Event not found");
    }

    switch (dynamicsEvent.pobl_casetype) {
      case 771570000:
        dynamicsEvent.pobl_casetype = "Accident";
        break;
      case 771570001:
        dynamicsEvent.pobl_casetype = "Incident";
        break;
      case 771570002:
        dynamicsEvent.pobl_casetype = "Near Miss";
        break;
      default:
        break;
    }

    try {
      const event = {
        id: dynamicsEvent.pobl_eventid,
        name: dynamicsEvent.pobl_casename,
        ref: dynamicsEvent.pobl_caseref,
        date: dynamicsEvent.pobl_eventdateandtime,
        caseType: dynamicsEvent.pobl_casetype,
        actionType: dynamicsEvent.pobl_actiontype,
        exactLocation: dynamicsEvent.pobl_exactlocationinfo,
        description:
          dynamicsEvent.pobl_description == null
            ? "No Description"
            : dynamicsEvent.pobl_description,
        impactscolleagues: dynamicsEvent.pobl_impactscolleagues,
        impactsexternalpeople: dynamicsEvent.pobl_impactsexternalpeople,
      };

      const locationData = await GetTeam(
        token,
        dynamicsEvent._pobl_locationoftheincident_value
      );

      event.location = locationData.pobl_teamname;

      res.status(200).json(event);
    } catch (error) {
      console.log("Error");
    }
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

  // Setting option set values
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

const getLookups = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const employees = await GetEmployees(token);
    const categories = await GetAccidentCategories(token);
    const injuries = await GetAccidentInjuries(token);
    const injuryParts = await GetAccidentInjuryParts(token);

    const lookups = {
      employees,
      categories,
      injuries,
      injuryParts,
    };

    res.status(200).json(lookups);
  } catch (error) {
    res.status(400).send(error);
  }
};

export { getEvents, getEventById, getEventTeams, createEvent, getLookups };
