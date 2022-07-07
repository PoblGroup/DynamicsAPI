import axios from "axios";

async function GetEmployeeByEmail(token, email) {
  let employee = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_employeehses?$filter=pobl_employeeemail eq '${email}' and statecode eq 0`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      employee = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(employee);
}

async function GetEmployeeById(token, id) {
  let employee = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_employeehses(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      employee = JSON.stringify({ data: response.data });
    })
    .catch(function (error) {
      employee = JSON.stringify({ error: error });
      // console.log(`Error ${error}`);
    });

  return JSON.parse(employee);
}

async function GetEmployees(token) {
  let employees = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_employeehses`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      employees = JSON.stringify(response.data);
    })
    .catch(function (error) {
      employees = JSON.stringify({ error: error.message });
    });

  return JSON.parse(employees);
}

export { GetEmployeeByEmail, GetEmployeeById, GetEmployees };
