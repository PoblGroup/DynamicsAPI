"use strict";

import {
  GetEmployeeById,
  GetEmployees,
} from "../../utils/Dynamics/Employee.js";
import {
  GetEventById,
  GetEvents,
  CreateEvent,
  GetAccidentCategories,
  GetAccidentInjuries,
  GetAccidentInjuryParts,
  UpdateEvent,
  GetWitnessTypes,
  GetEmergencyServices,
} from "../../utils/Dynamics/Events.js";
import { GetJobRolesByManager } from "../../utils/Dynamics/JobRoles.js";
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

        switch (event.pobl_actiontype) {
          case 771570000:
            event.pobl_actiontype = "Manager";
            break;
          case 771570001:
            event.pobl_actiontype = "Health & Safety";
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

    switch (dynamicsEvent.pobl_witnesstype) {
      case 771570000:
        dynamicsEvent.pobl_witnesstype = "None";
        break;
      case 771570001:
        dynamicsEvent.pobl_witnesstype = "Employee";
        break;
      case 771570002:
        dynamicsEvent.pobl_witnesstype = "Customer";
        break;
      default:
        break;
    }

    switch (dynamicsEvent.pobl_emergencyservice) {
      case 771570000:
        dynamicsEvent.pobl_emergencyservice = "Ambulance";
        break;
      case 771570001:
        dynamicsEvent.pobl_emergencyservice = "Fire Service";
        break;
      case 771570002:
        dynamicsEvent.pobl_emergencyservice = "Police";
        break;
      case 771570003:
        dynamicsEvent.pobl_emergencyservice = "Coastguard";
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
        investigationDate: dynamicsEvent.pobl_investigationdatetime,
        investigationFindings: dynamicsEvent.pobl_investigationfindings,
        investigationOutcome:
          dynamicsEvent.pobl_investigationoutcome == "771570001"
            ? "Passed to Health & Safety"
            : "Resolved",
        resolutionOutcome: dynamicsEvent.pobl_resolutionoutcome,
        witnessType: dynamicsEvent.pobl_witnesstype,
        witness: dynamicsEvent.pobl_witness,
        emergencyService: dynamicsEvent.pobl_emergencyservice,
        emergencyServiceDetails: dynamicsEvent.pobl_emergencyservicedetails,
        employeeTimeOff: dynamicsEvent.pobl_employeetimeoff,
        riskAssessentFollowed: dynamicsEvent.pobl_riskassessmentfollowed,
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
    const witnessTypes = await GetWitnessTypes(token);
    const emergencyServices = await GetEmergencyServices(token);

    const lookups = {
      employees,
      categories,
      injuries,
      injuryParts,
      witnessTypes,
      emergencyServices,
    };

    res.status(200).json(lookups);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getTeamEvents = async (req, res) => {
  const managerId = req.query.managerId;
  const token = req.headers["authorization"].split(" ")[1];
  let managerTeam = null;

  if (managerId) {
    try {
      const { data, error } = await GetJobRolesByManager(token, managerId);

      if (error)
        return res.status(error.status).json({ message: error.message });

      if (data.length > 0) {
        let members = await GetTeamMembers(token, data);
        managerTeam = members;
      }
      res.status(200).json(managerTeam);
    } catch (error) {
      res.status(400).send(error);
    }
  }
};

async function GetTeamMembers(token, roles) {
  let members = [];
  const promises = roles.map(async (role) => {
    // Role Title
    let memberRole = role.pobl_jobroletitle;
    // Employee
    let employee = await GetEmployeeById(
      token,
      role._pobl_jobroleemployeeid_value
    );
    let employeeName = employee.data.pobl_employeename;
    // Events
    let empEvents = await GetEvents(token, employee.data.pobl_employeehsid);
    empEvents.value.map((event) => {
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
      switch (event.pobl_actiontype) {
        case 771570000:
          event.pobl_actiontype = "Manager";
          break;
        case 771570001:
          event.pobl_actiontype = "Health and Safety";
          break;
        default:
          break;
      }
    });
    let events = empEvents.value;

    let member = { memberRole, employeeName, events };
    return member;
  });
  return Promise.all(promises);
}

const updateEvent = async (req, res) => {
  // console.log(req.body);
  // const newCase = {
  //   eventFindings: req.body.eventFindings,
  //   investigationDate: req.body.investigationDate,
  //   outcome: req.body.outcome,
  //   id: req.params.id,
  // };
  const token = req.headers["authorization"].split(" ")[1];

  const updated = await UpdateEvent(token, req.body);

  if (!updated)
    return res.status(500).json({ message: "Something went wrong" });

  res.status(200).json({
    updated: true,
    message: `Successfully updated case!`,
  });
};

export {
  getEvents,
  getEventById,
  getEventTeams,
  createEvent,
  getLookups,
  getTeamEvents,
  updateEvent,
};
