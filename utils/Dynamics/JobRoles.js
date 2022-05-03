import axios from "axios";

async function GetEmployeeJobRoles(token, id) {
  //   return "Job Roles";
  let roles = null;

  var config = {
    method: "get",
    // url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_jobroles`,
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_jobroles?$filter=_pobl_jobroleemployeeid_value eq '${id}'`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      roles = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(roles);
}

async function GetJobRolesByManager(token, managerId) {
  let jobRoles = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_jobroles?$filter=_pobl_jobrolereportstoid_value eq '${managerId}'`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      jobRoles = JSON.stringify({ data: response.data.value });
    })
    .catch(function (error) {
      jobRoles = JSON.stringify({ error: error });
    });

  return JSON.parse(jobRoles);
}

export { GetEmployeeJobRoles, GetJobRolesByManager };
