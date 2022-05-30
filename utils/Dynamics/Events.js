import axios from "axios";
import qs from "qs";
import { GetEmployeeById } from "../Dynamics/Employee.js";

async function GetEvents(token, employeeId) {
  let events = null;

  var config = {
    method: "get",
    // url: "https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_events",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_events?$filter=_pobl_employeeid_value eq '${employeeId}'`, // Get Event for Employee
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
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_events(${id})`,
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

  var config = {
    method: "post",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_events`,
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

async function UpdateEvent(token, investigationData) {
  var updated = false;

  if (investigationData.witnessType === "771570001") {
    // Get Employee
    const employee = await GetEmployeeById(token, investigationData.witness);
    investigationData.witness = employee.data.pobl_employeename;
  }

  var data = {
    pobl_investigationfindings: investigationData.eventFindings,
    pobl_investigationdatetime: investigationData.investigationDate,
    pobl_witnesstype: investigationData.witnessType,
    pobl_witness: investigationData.witness,
    pobl_emergencyservice:
      investigationData.emergencyService === ""
        ? null
        : investigationData.emergencyService,
    pobl_emergencyservicedetails: investigationData.emergencyServiceDetails,
    pobl_employeetimeoff: investigationData.employeeTimeOff,
    pobl_riskassessmentfollowed: investigationData.riskAssessment,
    pobl_investigationcompleted: new Date(),
  };

  if (
    investigationData.employeeTimeOff === true ||
    investigationData.riskAssessment === false
  ) {
    data.pobl_investigationoutcome = "771570001";
    data.pobl_actiontype = "771570001";
  } else {
    data.pobl_investigationoutcome = "771570000";
    data.pobl_resolutionoutcome = "771570000";
  }

  var config = {
    method: "patch",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_events(${investigationData.caseId})`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  await axios(config)
    .then(function (response) {
      if (response.status == 204) updated = true;
    })
    .catch(function (error) {
      console.log(error);
    });

  return updated;
}

// Accident Lookups
async function GetAccidentCategories(token) {
  let categories = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_accidentcategories`,
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
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_injurysustaineds`,
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
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_injuredparts`,
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

// Manager Investigation Lookups
async function GetWitnessTypes(token) {
  let witnessTypes = [];

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/GlobalOptionSetDefinitions(Name='pobl_witnesstype')`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      response.data.Options.map((o) => {
        witnessTypes.push({
          witnessTypeId: o.Value,
          witnessTypeName: o.Label.LocalizedLabels[0].Label,
        });
      });
    })
    .catch(function (error) {
      console.log(error.message);
    });

  return witnessTypes;
}

async function GetEmergencyServices(token) {
  let emergencyServices = [];

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/GlobalOptionSetDefinitions(Name='pobl_emergencyservice')`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      response.data.Options.map((o) => {
        emergencyServices.push({
          emergencyServiceId: o.Value,
          emergencyServiceName: o.Label.LocalizedLabels[0].Label,
        });
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  return emergencyServices;
}

export {
  GetEvents,
  GetEventById,
  CreateEvent,
  UpdateEvent,
  GetAccidentCategories,
  GetAccidentInjuries,
  GetAccidentInjuryParts,
  GetWitnessTypes,
  GetEmergencyServices,
};
