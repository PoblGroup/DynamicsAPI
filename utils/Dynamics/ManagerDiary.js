import axios from "axios";

export const GetManagerEntries = async (token, employeeId) => {
  let entries = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_managerdiaryentries?$filter=_pobl_diarymanagerid_value eq '${employeeId}' and pobl_diarytasksigned eq false and statecode eq 0`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      entries = response.data;
    })
    .catch(function (error) {
      entries = { error: error };
    });

  return entries;
};

export async function GetManagerEntry(token, id) {
  let data = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_managerdiaryentries(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      data = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
}

export async function UpdateManagerEntry(token, entry) {
  var updated = false;
  var data = null;

  if (entry.completion === "true") {
    data = {
      pobl_diarycompletenotes: entry.completionNotes,
      pobl_diarytasksigned: true,
      pobl_diarytaskcompletedon: new Date(),
    };
  } else {
    data = {
      pobl_diaryareascovered: entry.areasCovered,
      pobl_diarylefttodo: entry.areasRemaining,
    };
  }

  var config = {
    method: "patch",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_managerdiaryentries(${entry.id})`,
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

export async function GetManagerDiaryTask(token, id) {
  let document = null;
  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/pobl_managerdiarytasks(${id})`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      document = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return document;
}

export async function GetManagerDiaryTaskSharePointLocation(
  token,
  managerTaskId
) {
  var spLocation = null;

  var config = {
    method: "get",
    url: `https://${process.env.DYNAMICS_ENV}.api.crm11.dynamics.com/api/data/v9.2/sharepointdocumentlocations?$filter=_regardingobjectid_value eq '${managerTaskId}'`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      spLocation = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  if (spLocation.value.length > 0) {
    return spLocation.value[0].relativeurl;
  } else {
    return null;
  }
}

export async function GetManagerDiaryTaskFiles(folder) {
  const site = `https://pobl.sharepoint.com/sites/${process.env.SP_SITE}`;
  var files = [];
  var data = JSON.stringify({
    site: site,
    entity: "pobl_managerdiarytask",
    folder: folder,
  });

  var config = {
    method: "post",
    // HS - Get Related Documents
    url: "https://prod-31.uksouth.logic.azure.com:443/workflows/2f438c39437249198c571a855997ef7d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Hp8CrBCLgkrERHUlUjos7m8KybF2TQ_7Qb5l2iMck3g",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      files = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  files.map((f) => {
    f.url = `${site}/${f.url}`;
  });

  return files;
}
