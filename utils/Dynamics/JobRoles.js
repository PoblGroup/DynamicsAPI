import axios from "axios";

async function GetEmployeeJobRoles(token, id) {
  //   return "Job Roles";
  let roles = null;
  const enity = "";
  const field = "";

  var config = {
    method: "get",
    // url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_jobroles`,
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_jobroles?$filter=_pobl_jobroleemployeeid_value eq '${id}'`,
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

export { GetEmployeeJobRoles };
