import axios from "axios";
import qs from "qs";

async function GetEvents(token, employeeId) {
  let events = null;

  var config = {
    method: "get",
    // url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_events",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_events?$filter=_pobl_employeeid_value eq '${employeeId}'`, // Get Event for Employee
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      events = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(events);
}

async function GetEventById(token, id) {
  let event = null;

  var config = {
    method: "get",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_events(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      event = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(event);
}

async function CreateEvent(token, eventData) {
  let createdEvent = null;

  var data = JSON.stringify({
    pobl_casename: eventData.title,
    pobl_description: eventData.description,
    pobl_eventdateandtime: eventData.eventDate,
    "pobl_LocationoftheIncident@odata.bind":
      "/pobl_teams(" + eventData.locationId + ")",
    "pobl_EmployeeId@odata.bind":
      "/pobl_employeehses(" + eventData.employeeId + ")",
    "pobl_RegardingJobRoleId@odata.bind":
      "/pobl_jobroles(" + eventData.jobRoleId + ")",
    pobl_exactlocationinfo: eventData.exactLocation,
    pobl_casetype: eventData.caseType,
    pobl_actiontype: "771570000",
    "pobl_AffectedPersonEmployee@odata.bind":
      eventData.caseType === "771570000"
        ? "/pobl_employeehses(" + eventData.affectedPerson + ")"
        : "",
    pobl_affectedpersonnotes:
      eventData.caseType === "771570000" ? eventData.affectedPersonNotes : "",
    "pobl_AccidentCategory@odata.bind":
      eventData.caseType === "771570000"
        ? "/pobl_accidentcategories(" + eventData.category + ")"
        : "",
    "pobl_AccidentInjurySustained@odata.bind":
      eventData.caseType === "771570000"
        ? "/pobl_injurysustaineds(" + eventData.injury + ")"
        : "",
    "pobl_AccidentInjuredPart@odata.bind":
      eventData.caseType === "771570000"
        ? "/pobl_injuredparts(" + eventData.injuryPart + ")"
        : "",
  });

  console.log(JSON.parse(data));

  var config = {
    method: "post",
    url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_events",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      createdEvent = JSON.stringify({
        status: 200,
        createdEvent: response.headers["odata-entityid"],
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(createdEvent);
}

// Accident Lookups
async function GetAccidentCategories(token) {
  let categories = null;

  var config = {
    method: "get",
    url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_accidentcategories",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      categories = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(categories);
}

async function GetAccidentInjuries(token) {
  let injuries = null;

  var config = {
    method: "get",
    url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_injurysustaineds",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      injuries = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(injuries);
}

async function GetAccidentInjuryParts(token) {
  let injuryParts = null;

  var config = {
    method: "get",
    url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_injuredparts",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      injuryParts = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(injuryParts);
}

export {
  GetEvents,
  GetEventById,
  CreateEvent,
  GetAccidentCategories,
  GetAccidentInjuries,
  GetAccidentInjuryParts,
};
