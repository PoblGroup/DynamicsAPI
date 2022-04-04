import axios from "axios";

async function GetPolicyResponses(token, employeeId) {
  let responses = null;

  var config = {
    method: "get",
    // url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocumentresponses",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocumentresponses?$filter=_pobl_responseemployeeid_value eq '${employeeId}' and pobl_responsesigned eq false`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      responses = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  return JSON.parse(responses);
}

async function GetPolicyResponseById(token, id) {
  let data = null;

  var config = {
    method: "get",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocumentresponses(${id})`,
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

async function GetPolicyDocuments(token, id) {
  let documents = null;
  var config = {
    method: "get",
    url: "https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocuments",
    // url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocuments?$filter=pobl_policydocumentid eq '${id}'`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      documents = JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return JSON.parse(documents);
}

async function GetPolicyDocumentById(token, id) {
  let document = null;
  var config = {
    method: "get",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocuments(${id})`,
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

  switch (document.pobl_documentcategory) {
    case 771570000:
      document.pobl_documentcategory = "Risk Assesment";
      break;
    case 771570001:
      document.pobl_documentcategory = "Policy";
      break;
    case 771570002:
      document.pobl_documentcategory = "Toolbox Talk";
      break;
    default:
      break;
  }

  switch (document.pobl_documenttargets) {
    case 771570000:
      document.pobl_documenttargets = "Division";
      break;
    case 771570001:
      document.pobl_documenttargets = "Department";
      break;
    case 771570002:
      document.pobl_documenttargets = "Team";
      break;
    default:
      break;
  }

  return document;
}

async function GetPolicyDocumentSharePointLocation(token, policyDocumentId) {
  var spLocation = null;

  var config = {
    method: "get",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/sharepointdocumentlocations?$filter=_regardingobjectid_value eq '${policyDocumentId}'`,
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

async function GetPolicyDocumentFiles(folder) {
  const site = "https://pobl.sharepoint.com/sites/PDyn_Dev";
  var files = [];
  var data = JSON.stringify({
    site: site,
    entity: "pobl_policydocument",
    folder: folder,
  });

  var config = {
    method: "post",
    url: "https://prod-10.uksouth.logic.azure.com:443/workflows/98c2fcfdb2384cefa07951992f7fe174/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1c2T8VMC9l2bxq3KIOHcH1F9mGCxkzKv9FJ7pytAAQs",
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

async function updatePolicyResponse(token, id) {
  let updatedResponse = false;

  var data = JSON.stringify({
    pobl_responsesigned: true,
  });

  var config = {
    method: "patch",
    url: `https://stephen.api.crm11.dynamics.com/api/data/v9.2/pobl_policydocumentresponses(${id})`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      updatedResponse = response.status == 204 ? true : false;
    })
    .catch(function (error) {
      console.log(error);
    });

  return updatedResponse;
}

export {
  GetPolicyResponses,
  GetPolicyResponseById,
  GetPolicyDocuments,
  GetPolicyDocumentById,
  GetPolicyDocumentSharePointLocation,
  GetPolicyDocumentFiles,
  updatePolicyResponse,
};
