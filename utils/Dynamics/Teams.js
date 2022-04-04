import axios from "axios";

async function GetTeams(token) {
  let teams = null;
  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_teams`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      teams = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return JSON.parse(teams);
}

async function GetTeam(token, id) {
  let team = null;
  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_teams(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      team = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return JSON.parse(team);
}

export { GetTeams, GetTeam };
