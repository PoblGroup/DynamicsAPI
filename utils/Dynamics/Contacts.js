import axios from "axios";
import qs from "qs";

async function GetDyamicsContacts(token) {
  let contacts = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      contacts = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(contacts);
}

async function GetDyamicsContactById(token, id) {
  let contact = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/contacts(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      contact = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(contact);
}

export { GetDyamicsContacts, GetDyamicsContactById };
