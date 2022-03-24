import axios from "axios";

async function GetEmployeeByEmail(token, email) {
  let employee = null;

  var config = {
    method: "get",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_employeehses?$filter=pobl_employeeemail eq '${email}'`,
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

export { GetEmployeeByEmail };
