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
    pobl_exactlocationinfo: eventData.exactLocation,
    pobl_casetype: eventData.caseType,
  });

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

export { GetEvents, GetEventById, CreateEvent };
